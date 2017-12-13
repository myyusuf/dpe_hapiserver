const XLSX = require('xlsx');
const models = require('../models');

const CASH_FLOW_SHEET_POSITION = 2;

const deleteCashFlowTable = year => (
  new Promise((resolve, reject) => {
    models.CashFlowItem.destroy({
      where: {},
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

const insertCashFlowItem = cashFlowItemData => (
  new Promise((resolve, reject) => {
    models.CashFlowItem.create(cashFlowItemData)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const insertCashFlow = cashFlowData => (
  new Promise((resolve, reject) => {
    const promises = [];
    models.CashFlow.create(cashFlowData)
    .then((result) => {
      const cashFlowId = result.id;
      const cashFlowItems = cashFlowData.items;
      for (let i = 0; i < cashFlowItems.length; i += 1) {
        const item = cashFlowItems[i];
        item.CashFlowId = cashFlowId;
        promises.push(insertCashFlowItem(item));
      }
      Promise.all(promises)
      .then(() => {
        resolve(result);
      }).error((err) => {
        reject(err);
      });
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

const readCashFlowItems = (worksheet, startRow) => {
  const cashFlowItems = [];
  const initialColumnPosition = 21;
  for (let month = 1; month <= 12; month += 1) {
    const columnPosition = initialColumnPosition + ((month - 1) * 3);
    const projectData = {
      ra: readCell(worksheet, startRow, columnPosition) || 0,
      prog: readCell(worksheet, startRow, columnPosition + 1) || 0,
      ri: readCell(worksheet, startRow, columnPosition + 1) || 0,
      month,
    };
    cashFlowItems.push(projectData);
  }
  return cashFlowItems;
};

const readAllCashFlowDataInAYear = (worksheet, year) => {
  const allCashFlowDataInAYear = [];
  const saldoAwal = {
    year,
    rkap: readCell(worksheet, 11, 19) || 0,
    rolling: readCell(worksheet, 11, 20) || 0,
    items: readCashFlowItems(worksheet, 11),
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
