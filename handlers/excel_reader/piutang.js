const XLSX = require('xlsx');

const PIUTANG_SHEET_POSITION = 1;

const deletePiutangTable = (db, year) => (
  new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM piutang WHERE year = ?',
      [year],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  })
);

const insertPiutang = (db, projectData) => (
  new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO piutang (
        project_id,
        owner,
        pdp_1,
        tagihan_bruto_1,
        piutang_usaha_1,
        piutang_retensi_1,
        pdp_2,
        tagihan_bruto_2,
        piutang_usaha_2,
        piutang_retensi_2,
        pdp_3,
        tagihan_bruto_3,
        piutang_usaha_3,
        piutang_retensi_3,
        pdp_4,
        tagihan_bruto_4,
        piutang_usaha_4,
        piutang_retensi_4,
        pdp_5,
        tagihan_bruto_5,
        piutang_usaha_5,
        piutang_retensi_5,
        month,
        year
      )
      SELECT
        id, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?
      FROM project WHERE code = ? `,
      [
        projectData.owner,
        projectData.pdp1,
        projectData.tagihanBruto1,
        projectData.piutangUsaha1,
        projectData.piutangRetensi1,
        projectData.pdp2,
        projectData.tagihanBruto2,
        projectData.piutangUsaha2,
        projectData.piutangRetensi2,
        projectData.pdp3,
        projectData.tagihanBruto3,
        projectData.piutangUsaha3,
        projectData.piutangRetensi3,
        projectData.pdp4,
        projectData.tagihanBruto4,
        projectData.piutangUsaha4,
        projectData.piutangRetensi4,
        projectData.pdp5,
        projectData.tagihanBruto5,
        projectData.piutangUsaha5,
        projectData.piutangRetensi5,
        projectData.month,
        projectData.year,
        projectData.projectCode,
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

const readProjectDataInAYear = (worksheet, year, startRow) => {
  const projectDataInAYear = [];
  const initialColumnPosition = 7;
  for (let month = 1; month <= 12; month += 1) {
    const columnPosition = initialColumnPosition + ((month - 1) * 6);
    const projectData = {
      owner: readCell(worksheet, startRow, 2) || 0,
      projectCode: readCell(worksheet, startRow, 5),
      pdp1: readCell(worksheet, startRow, columnPosition) || 0,
      tagihanBruto1: readCell(worksheet, startRow + 1, columnPosition) || 0,
      piutangUsaha1: readCell(worksheet, startRow + 2, columnPosition) || 0,
      piutangRetensi1: readCell(worksheet, startRow + 3, columnPosition) || 0,
      pdp2: readCell(worksheet, startRow, columnPosition + 1) || 0,
      tagihanBruto2: readCell(worksheet, startRow + 1, columnPosition + 1) || 0,
      piutangUsaha2: readCell(worksheet, startRow + 2, columnPosition + 1) || 0,
      piutangRetensi2: readCell(worksheet, startRow + 3, columnPosition + 1) || 0,
      pdp3: readCell(worksheet, startRow, columnPosition + 2) || 0,
      tagihanBruto3: readCell(worksheet, startRow + 1, columnPosition + 2) || 0,
      piutangUsaha3: readCell(worksheet, startRow + 2, columnPosition + 2) || 0,
      piutangRetensi3: readCell(worksheet, startRow + 3, columnPosition + 2) || 0,
      pdp4: readCell(worksheet, startRow, columnPosition + 3) || 0,
      tagihanBruto4: readCell(worksheet, startRow + 1, columnPosition + 3) || 0,
      piutangUsaha4: readCell(worksheet, startRow + 2, columnPosition + 3) || 0,
      piutangRetensi4: readCell(worksheet, startRow + 3, columnPosition + 3) || 0,
      pdp5: readCell(worksheet, startRow, columnPosition + 4) || 0,
      tagihanBruto5: readCell(worksheet, startRow + 1, columnPosition + 4) || 0,
      piutangUsaha5: readCell(worksheet, startRow + 2, columnPosition + 4) || 0,
      piutangRetensi5: readCell(worksheet, startRow + 3, columnPosition + 4) || 0,
      month,
      year,
    };
    projectDataInAYear.push(projectData);
  }
  return projectDataInAYear;
};

const readAllProjectsDataInAYear = (worksheet, year) => {
  const allProjectsDataInAYear = [];
  for (let row = 4; row <= 29; row += 5) {
    if (readCell(worksheet, row, 0)) {
      allProjectsDataInAYear.push(...readProjectDataInAYear(worksheet, year, row));
    }
  }
  return allProjectsDataInAYear;
};

exports.readExcel = (fileName, db) => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[PIUTANG_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const allProjectsDataInAYear = readAllProjectsDataInAYear(worksheet, year);
    debugger;
    const promises = [];
    deletePiutangTable(db, year)
    .then(() => {
      for (let i = 0; i < allProjectsDataInAYear.length; i += 1) {
        promises.push(db, insertPiutang(db, allProjectsDataInAYear[i]));
      }
      Promise.all(promises)
      .then(() => {
        resolve({ status: 'OK' });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
