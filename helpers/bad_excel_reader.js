const XLSX = require('xlsx');
const models = require('../models');

const BAD_SHEET_POSITION = 3;
const MAXIMUM_ROW = 150;

const deleteBadTable = year => (
  new Promise((resolve, reject) => {
    models.Bad.destroy({
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

const getProjectIds = () => (
  new Promise((resolve, reject) => {
    const projectIds = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i];
        projectIds[project.code] = project.id;
      }
      resolve(projectIds);
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

const isEndOfData = (worksheet, rowNum) => {
  const cellData = readCell(worksheet, rowNum, 0);
  if (cellData.trim() === 'TOTAL') {
    return true;
  }
  return false;
};

exports.readExcel = fileName => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[BAD_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const bads = [];
    deleteBadTable(year)
    .then(() => {
      getProjectIds()
      .then((projectIds) => {
        const startRow = 27;
        for (let i = startRow; i < (startRow + MAXIMUM_ROW); i += 1) {
          if (isEndOfData(worksheet, i)) {
            break;
          }
          const projectCode = readCell(worksheet, i, 6);
          const projectId = projectIds[projectCode];
          if (projectId) {
            const piutangUsaha = readCell(worksheet, i, 1);
            const tagihanBruto = readCell(worksheet, i, 2);
            const piutangRetensi = readCell(worksheet, i, 3);
            const pdp = readCell(worksheet, i, 4);
            const bad = readCell(worksheet, i, 5);
            bads.push({
              ProjectId: projectId,
              piutangUsaha,
              tagihanBruto,
              piutangRetensi,
              pdp,
              bad,
            });
          }
        }

        models.Bad.bulkCreate(bads)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
