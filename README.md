# Concatenate PDF

[![Greenkeeper badge](https://badges.greenkeeper.io/g-ongenae/Concatenate-PDF.svg)](https://greenkeeper.io/)

A **useless** little script to concatenate PDF using [Scissors](https://github.com/tcr/scissors).

All the PDF you want to concatenate needs to have the same name except for their indexes, for instance:

- test0.pdf
- test1.pdf
- test2.pdf

This will create `test.pdf`.

(This pattern `/^(*[0-9].pdf)$/`.)

## To Run:

Install [PDFTK](http://www.pdflabs.com/docs/install-pdftk/)
  on your system. Mac OS >=10.11 requires a patched build available
  [here](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg)
  as per [this thread](http://stackoverflow.com/questions/32505951/pdftk-server-on-os-x-10-11)

```
git clone https://github.com/g-ongenae/Concatenate-PDF
cd Concatenate-PDF/
yarn install
yarn start
```
