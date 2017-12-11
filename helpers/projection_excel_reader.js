const XLSX = require('xlsx');
const models = require('../models');

const PROJECTION_SHEET_POSITION = 2;

const deleteProjectionTable = year => (
  new Promise((resolve, reject) => {
    models.Projection.destroy({
      where: { year },
    })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const bulkInsertProjection = projections => (
  new Promise((resolve, reject) => {
    models.Projection.bulkCreate(projections)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
    // db.query(
    //   `INSERT INTO proyeksi (
    //     pdp,
    //     tagihan_bruto,
    //     piutang_usaha,
    //     piutang_retensi,
    //     month,
    //     year
    //   )
    //   VALUES ?`,
    //   [
    //     projections,
    //   ],
    //   (err, result) => {
    //     if (err) reject(err);
    //     resolve(result);
    //   });
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

exports.readExcel = fileName => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[PROJECTION_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const projectionsDataInAYear = readProjectionsDataInAYear(worksheet, year, 4);
    deleteProjectionTable(year)
    .then(() => {
      bulkInsertProjection(projectionsDataInAYear).then(() => {
        resolve({ status: 'OK' });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
