#!/usr/bin/env node
'use strict'

const co = require('co')
const fs = require('fs')
const os = require('os')
const inquirer = require('inquirer')
const scissors = require('scissors')
const program = require('commander')

const checkPath = (path) => {
  if (path[0] === '.') {
    path = __dirname + path.slice(1)
  }
  if (path[0] === '~') {
    path = os.homedir + path.slice(1)
  }
  return path
}

const concatenate = () => {
  co(function *() {
    console.log('Getting ready for PDF Concatenation...')
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
        throw new Error('PDF file at ' + tmpPath + ' does not exists')
      }
    }

    const output = filesToConcatenate + '.pdf'

    pdfBuffers
      .pdfStream()
      .pipe(fs.createWriteStream(output))
      .on('finish', () => {
        console.log('The new pdf is ready at ' + output)
      })
      .on('error', (error) => {
        throw new Error('An error occured while concatening the PDFs:', error)
      })
  }).catch((error) => {
    console.error(error)
  })
}

const remove = () => {
  co(function *() {
    console.log('Getting ready to remove some pages of the PDF')
    const userInput = yield inquirer.prompt([
      {
        type: 'input',
        message: 'Where are the files you need to remove page from ?',
        name: 'input'
      },
      {
        type: 'input',
        message: 'What are the path you want the new PDF to be save at ?',
        name: 'output',
        default: 'override'
      },
      {
        type: 'number',
        message: 'Which page you want to keep (start) ?',
        name: 'start',
        default: 0
      },
      {
        type: 'number',
        message: 'Which page you want to keep (finish) ?',
        name: 'finish',
        default: 0
      }
    ])

    const input = checkPath(userInput.input)
    const output = userInput.output === 'override' ? input : checkPath(userInput.output)

    scissors(input)
      .range(userInput.start, userInput.finish)
      .pdfStream()
      .pipe(fs.createWriteStream(output))
      .on('finish', () => {
        console.log('The PDF is ready at' + output)
      })
      .on('error',(error) => {
        throw new Error('An error occured while removing pages in the PDF:', error);
      })
  }).catch((error) => {
    console.error(error)
  })
}

program
  .version('1.0.1')
  .usage('[options]')
  .option('-c, --concatenate', 'Concatenate PDF', concatenate)
  .option('-r, --remove', 'Remove Pages', remove)
  .parse(process.argv)
