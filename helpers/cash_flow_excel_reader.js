const XLSX = require('xlsx');
const models = require('../models');

const CASH_FLOW_SHEET_POSITION = 2;

const deleteCashFlowTable = year => (
  new Promise((resolve, reject) => {
    models.CashFlowItem.destroy({
      include: [
        { model: models.CashFlow, where: { year } },
      ],
    })
    .then(() => {
      models.CashFlow.destroy({
        where: { year },
      }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const insertCashFlow = cashFlowData => (
  new Promise((resolve, reject) => {
    models.CashFlow.create(cashFlowData)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
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

const readAllCashFlowDataInAYear = (worksheet, year) => {
  const allCashFlowDataInAYear = [];
  const saldoAwal = {
    year,
    rkap: readCell(worksheet, 12, 19) || 0,
  };
  allCashFlowDataInAYear.push(saldoAwal);
  return allCashFlowDataInAYear;
};

exports.readExcel = fileName => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[CASH_FLOW_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const allCashFlowDataInAYear = readAllCashFlowDataInAYear(worksheet, year);
    const promises = [];
    deleteCashFlowTable(year)
    .then(() => {
      for (let i = 0; i < allCashFlowDataInAYear.length; i += 1) {
        promises.push(insertCashFlow(allCashFlowDataInAYear[i]));
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
