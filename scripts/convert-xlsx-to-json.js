const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('ETEC_words.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

fs.writeFileSync('data/questions.json', JSON.stringify(data, null, 2));
console.log('ETEC_words.xlsx → data/questions.json 変換完了');
