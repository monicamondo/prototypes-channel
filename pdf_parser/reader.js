const fs = require('fs');
const pdfParser = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Dev\\Jexperts\\Channel\\prototypes-channel\\R1-RQ4\\docs\\RQ004+-+Criar+o+conceito+de+resultados+chave.pdf');
pdfParser(dataBuffer).then(function(data) {
    console.log(data.text);
});
