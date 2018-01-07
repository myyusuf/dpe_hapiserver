const models = require('../../models');

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
      }).catch((err) => {
        reject(err);
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const year = batchData.year;
    const allCashFlowDataInAYear = batchData.payload;
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
