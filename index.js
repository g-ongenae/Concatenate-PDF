'use strict'

const co = require('co')
const fs = require('fs')
const os = require('os')
const inquirer = require('inquirer')
const scissors = require('scissors')

const checkPath = (path) => {
  if (path[0] === '.') {
    path = __dirname + path.slice(1)
  }
  if (path[0] === '~') {
    path = os.homedir + path.slice(1)
  }
  return path
}

co(function *() {
  console.log('Guetting ready for PDF Concatenation...')
  const input = yield inquirer.prompt([
    {
      type: 'input',
      message: 'Where are the files you need to concatenate ?',
      name: 'paths'
    },
    {
      type: 'number',
      message: 'How many pages do you have to concatenate ?',
      name: 'number'
    }
  ])

  const filesToConcatenate = checkPath(input.paths)
  let pdfBuffers
  const numberOfPages = parseInt(input.number)

  for (let i = 0; i < numberOfPages; i++) {
    let tmpPath = filesToConcatenate + i + '.pdf'
    if (fs.existsSync(tmpPath)) {
      if (i === 0) {
        pdfBuffers = scissors(tmpPath)
      } else {
        pdfBuffers = scissors.join(pdfBuffers, scissors(tmpPath))
      }
    } else {
      throw new Error('pdf file at ' + tmpPath + ' does not exists')
    }
  }

  const output = filesToConcatenate.slice(0,-1) + '.pdf'

  pdfBuffers
    .pdfStream()
    .pipe(fs.createWriteStream(output))
    .on('finish', () => {
      console.log('The new pdf is ready at ' + output)
    })
    .on('error', (error) => {
      throw new Error('An error occured while concatening the pdfs:', error)
    })
}).catch((error) => {
  console.error(error)
})
