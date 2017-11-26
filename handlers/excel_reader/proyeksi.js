const XLSX = require('xlsx');

const PROYEKSI_SHEET_POSITION = 2;

const deleteProyeksiTable = (db, year) => (
  new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM proyeksi WHERE year = ?',
      [year],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  })
);

const bulkInsertProyeksi = (db, projections) => (
  new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO proyeksi (
        pdp,
        tagihan_bruto,
        piutang_usaha,
        piutang_retensi,
        month,
        year
      )
      VALUES ?`,
      [
        projections,
      ],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  })
);
const readCell = (worksheet, rowNum, colNum) => {
  const cellIdentity = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
  return worksheet[cellIdentity] ? worksheet[cellIdentity].v : '';
};

const readProjectionsDataInAYear = (worksheet, year, startRow) => {
  const projectionDataInAYear = [];
  const initialColumnPosition = 2;
  for (let month = 1; month <= 12; month += 1) {
    const columnPosition = initialColumnPosition + (month - 1);
    const projectionData = {
      pdp: readCell(worksheet, startRow, columnPosition) || 0,
      tagihanBruto: readCell(worksheet, startRow + 1, columnPosition) || 0,
      piutangUsaha: readCell(worksheet, startRow + 2, columnPosition) || 0,
      piutangRetensi: readCell(worksheet, startRow + 3, columnPosition) || 0,
      month,
      year,
    };
    projectionDataInAYear.push([
      projectionData.pdp,
      projectionData.tagihanBruto,
      projectionData.piutangUsaha,
      projectionData.piutangRetensi,
      projectionData.month,
      year,
    ]);
  }
  return projectionDataInAYear;
};

exports.readExcel = (fileName, db) => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[PROYEKSI_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const projectionsDataInAYear = readProjectionsDataInAYear(worksheet, year, 4);
    const promises = [];
    deleteProyeksiTable(db, year)
    .then(() => {
      bulkInsertProyeksi(db, projectionsDataInAYear).then(() => {
        resolve({ status: 'OK' });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
