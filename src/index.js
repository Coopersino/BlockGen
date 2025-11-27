#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { buildHtmlDocument } = require('./htmlBuilder');

function parseWorkbook(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error('В книге отсутствуют листы.');
  }

  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header, index) => header || `Столбец ${index + 1}`);
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index] ?? '';
    });
    return rowObject;
  });
}

function showUsage() {
  console.log('Использование: node src/index.js <путь_к_xls> [путь_к_html]');
  console.log('Если путь к html не указан, файл создается рядом с исходной таблицей.');
}

function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath) {
    showUsage();
    process.exit(1);
  }

  const absoluteInputPath = path.resolve(process.cwd(), inputPath);

  if (!fs.existsSync(absoluteInputPath)) {
    console.error(`Файл ${absoluteInputPath} не найден.`);
    process.exit(1);
  }

  try {
    const rows = parseWorkbook(absoluteInputPath);
    const html = buildHtmlDocument(rows, path.basename(inputPath));

    const absoluteOutputPath = outputPath
      ? path.resolve(process.cwd(), outputPath)
      : path.join(path.parse(absoluteInputPath).dir, `${path.parse(absoluteInputPath).name}.html`);

    fs.writeFileSync(absoluteOutputPath, html, 'utf8');
    console.log(`Создан файл ${absoluteOutputPath}. Количество блоков: ${rows.length}`);
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseWorkbook };
