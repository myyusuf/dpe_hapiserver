const XLSX = require('xlsx');
const models = require('../models');

const PIUTANG_SHEET_POSITION = 1;

const deletePiutangTable = year => (
  new Promise((resolve, reject) => {
    models.Piutang.destroy({
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

const insertPiutang = projectData => (
  new Promise((resolve, reject) => {
    const projectCodes = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i];
        projectCodes[project.code] = project.id;
      }

      const tempProjectData = projectData;
      tempProjectData.ProjectId = projectCodes[projectData.projectCode];
      delete tempProjectData.projectCode;
      models.Piutang.create(tempProjectData)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
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

exports.readExcel = fileName => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[PIUTANG_SHEET_POSITION]];
    // const yearCellValue = worksheet.F6.v;
    const year = 2017;
    const allProjectsDataInAYear = readAllProjectsDataInAYear(worksheet, year);
    const promises = [];
    deletePiutangTable(year)
    .then(() => {
      for (let i = 0; i < allProjectsDataInAYear.length; i += 1) {
        promises.push(insertPiutang(allProjectsDataInAYear[i]));
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
