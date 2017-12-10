const XLSX = require('xlsx');
const models = require('../models');

const INPUTAN_SHEET_POSITION = 0;
const RINCIAN_SHEET_POSITION = 1;

exports.readExcel = function (fileName, callback) {
  const workbook = XLSX.readFile(fileName);
  const worksheet = workbook.Sheets[workbook.SheetNames[INPUTAN_SHEET_POSITION]];

  const yearCellValue = worksheet.F6.v;
  const YEAR = 2017; // parseInt(yearCellValue.match(/[0-9]+/)[0], 10);

  models.ProjectProgress.destroy(
    {
      where: { year: YEAR },
    })
  .then((result) => {
    getExistingProjectCodes()
    .then((existingProjectCodes) => {
      readExcel1(fileName, YEAR, existingProjectCodes)
      .then(() => {
        readExcel2(fileName, YEAR)
        .then(() => {
          readClaim(fileName, YEAR)
          .then(() => {
            callback({
              status: 'OK',
            });
          });
        })
        .catch((err) => {
          callback({
            status: 'UNKNOWN_ERROR',
            payload: err.message,
          });
        });
      }).catch((errx) => {
        console.log(errx);
        callback({
          status: 'ERROR',
          payload: errx.payload,
        });
      });
    })
    .catch((erry) => {
      callback({
        status: 'UNKNOWN_ERROR',
        payload: erry.message,
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
};

const getExistingProjectCodes = () => {
  return new Promise((resolve, reject) => {
    models.Project.findAll({
      where: {},
    })
    .then((rows) => {
      const projectCodes = rows.map(row => row.code);
      resolve(projectCodes);
    });
  });
};

const readExcel1 = (fileName, theYear, existingProjectCodes) => {

  let theExistingProjectCodes = [];
  if (existingProjectCodes) {
    theExistingProjectCodes = existingProjectCodes;
  }
  return new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);

    const firstSheetName = workbook.SheetNames[INPUTAN_SHEET_POSITION];//= 'INPUTAN';
    const worksheet = workbook.Sheets[firstSheetName];

    const projectProgresses = [];

    const colNames = ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR'
    ];

    const getProjectProgress = (projectCode, row, month, year) => {
      let cellMonthPositionInit = (month - 1) * 3;
      let cellName = colNames[cellMonthPositionInit] + row;
      const rkapOk = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      const prognosaOk = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      const realisasiOk = worksheet[cellName] ? worksheet[cellName].v : 0;

      cellMonthPositionInit += 1;
      cellName = colNames[cellMonthPositionInit] + row;
      const rkapOp = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      const prognosaOp = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      const realisasiOp = worksheet[cellName] ? worksheet[cellName].v : 0;

      cellMonthPositionInit += 1;
      cellName = colNames[cellMonthPositionInit] + row;
      const rkapLk = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      const prognosaLk = worksheet[cellName] ? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      const realisasiLk = worksheet[cellName] ? worksheet[cellName].v : 0;

      const projectProgress = {
        month,
        year,
        projectCode,
        rkapOk,
        rkapOp,
        rkapLk,
        prognosaOk,
        prognosaOp,
        prognosaLk,
        realisasiOk,
        realisasiOp,
        realisasiLk,
      };

      return projectProgress;
    };

    for (let row = 11; row < 500; row += 1) {
      let projectCode = worksheet['C' + row] ? worksheet['C' + row].v : '';

      if (projectCode != '') {

        if (projectCode == 'END') {
          break;
        }

        projectCode = projectCode.trim();

        for (let month = 1; month <= 12; month += 1) {
          const tmpProjectProgress = getProjectProgress(projectCode, row, month, theYear, worksheet);
          projectProgresses.push(tmpProjectProgress);
        }
        row += 2;
      }
    }

    const promises = [];
    const unrecoredProjectProgresses = projectProgresses.filter((projectProgress) => {
      return !theExistingProjectCodes.includes(projectProgress.projectCode);
    });

    if (unrecoredProjectProgresses.length > 0) {

      const unrecoredProjectCodes = unrecoredProjectProgresses.map((projectProgress) => {
        return projectProgress.projectCode;
      });

      const uniq = function uniq(a) {
        return Array.from(new Set(a));
      };

      const unrecoredProjectCodesUnique = uniq(unrecoredProjectCodes);

      reject({
        cause: 'UNRECORDED_PROJECT_CODES',
        payload: unrecoredProjectCodesUnique,
      });
      return;
    }

    const projectCodes = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let indexProject = 0; indexProject < projects.length; indexProject += 1) {
        const project = projects[indexProject];
        projectCodes[project.code] = project.id;
      }

      for (let i = 0; i < projectProgresses.length; i += 1) {
        const projectCode = projectProgresses[i].projectCode;
        const year = projectProgresses[i].year;
        const month = projectProgresses[i].month;

        const rkapOk = projectProgresses[i].rkapOk;
        const rkapOp = projectProgresses[i].rkapOp;
        const rkapLk = projectProgresses[i].rkapLk;

        const realisasiOk = projectProgresses[i].realisasiOk;
        const realisasiOp = projectProgresses[i].realisasiOp;
        const realisasiLk = projectProgresses[i].realisasiLk;

        const prognosaOk = projectProgresses[i].prognosaOk;
        const prognosaOp = projectProgresses[i].prognosaOp;
        const prognosaLk = projectProgresses[i].prognosaLk;

        promises.push(new Promise((resolve2, reject2) => {
          models.ProjectProgress.create({
            year,
            month,
            rkapOk,
            rkapOp,
            rkapLk,
            realisasiOk,
            realisasiOp,
            realisasiLk,
            prognosaOk,
            prognosaOp,
            prognosaLk,
            ProjectId: projectCodes[projectCode],
          })
          .then(() => {
            resolve2({
              // affectedRows: result.affectedRows,
              // projectCode,
            });
          })
          .catch((err) => {
            reject2(err);
          });
        }));
      }

      Promise.all(promises)
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
    });
  });
};

const readExcel2 = function (fileName, db, theYear) {
    return new Promise((resolve, reject) => {
      var workbook = XLSX.readFile(fileName);

      var firstSheetName = workbook.SheetNames[RINCIAN_SHEET_POSITION];//= 'Lap';
      var worksheet = workbook.Sheets[firstSheetName];

      var labaSetelahPajak = [];

      var getData = function(cellName, ws){

        return ws[cellName]? ws[cellName].v : 0;
      }

      for (let row = 8; row < 150; row += 1) {
        const name = worksheet['C' + row] ? worksheet['C' + row].v : '';

        if(name == 'Laba Setelah Pajak'){

          console.log('Insert lsp');

          labaSetelahPajak.push({
            month: 1,
            year: theYear,
            lsp_rkap: getData(('J' + row), worksheet),
            lsp_prognosa: getData(('M' + row), worksheet),
            lsp_realisasi: getData(('P' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 2,
            year: theYear,
            lsp_rkap: getData(('S' + row), worksheet),
            lsp_prognosa: getData(('V' + row), worksheet),
            lsp_realisasi: getData(('Y' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 3,
            year: theYear,
            lsp_rkap: getData(('AB' + row), worksheet),
            lsp_prognosa: getData(('AE' + row), worksheet),
            lsp_realisasi: getData(('AH' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 4,
            year: theYear,
            lsp_rkap: getData(('AK' + row), worksheet),
            lsp_prognosa: getData(('AN' + row), worksheet),
            lsp_realisasi: getData(('AQ' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 5,
            year: theYear,
            lsp_rkap: getData(('AT' + row), worksheet),
            lsp_prognosa: getData(('AW' + row), worksheet),
            lsp_realisasi: getData(('AZ' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 6,
            year: theYear,
            lsp_rkap: getData(('BC' + row), worksheet),
            lsp_prognosa: getData(('BF' + row), worksheet),
            lsp_realisasi: getData(('BI' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 7,
            year: theYear,
            lsp_rkap: getData(('BL' + row), worksheet),
            lsp_prognosa: getData(('BO' + row), worksheet),
            lsp_realisasi: getData(('BR' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 8,
            year: theYear,
            lsp_rkap: getData(('BU' + row), worksheet),
            lsp_prognosa: getData(('BX' + row), worksheet),
            lsp_realisasi: getData(('CA' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 9,
            year: theYear,
            lsp_rkap: getData(('CD' + row), worksheet),
            lsp_prognosa: getData(('CG' + row), worksheet),
            lsp_realisasi: getData(('CJ' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 10,
            year: theYear,
            lsp_rkap: getData(('CM' + row), worksheet),
            lsp_prognosa: getData(('CP' + row), worksheet),
            lsp_realisasi: getData(('CS' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 11,
            year: theYear,
            lsp_rkap: getData(('CV' + row), worksheet),
            lsp_prognosa: getData(('CY' + row), worksheet),
            lsp_realisasi: getData(('DB' + row), worksheet),
          });

          labaSetelahPajak.push({
            month: 12,
            year: theYear,
            lsp_rkap: getData(('DE' + row), worksheet),
            lsp_prognosa: getData(('DH' + row), worksheet),
            lsp_realisasi: getData(('DK' + row), worksheet),
          });

          break;
        }
      }

      const insertToDb = function (labaSetelahPajakArray) {
        for (let i = 0; i < labaSetelahPajakArray.length; i += 1) {
          const lsp = labaSetelahPajakArray[i];
          console.log('Insert labaSetelahPajak : ', JSON.stringify(labaSetelahPajak));

          models.Lsp.create({
            year: lsp.year,
            month: lsp.month,
            lspRkap: lsp.lsp_rkap,
            lspPrognosa: lsp.lsp_prognosa,
            lspRealisasi: lsp.lsp_realisasi,
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });

          // const query = 'INSERT INTO lsp (year, month, lsp_rkap, lsp_prognosa, lsp_realisasi) ' +
          // 'VALUES (?, ?, ?, ?, ?)';
          //
          // db.query(query,
          //   [
          //     labaSetelahPajak.year,
          //     labaSetelahPajak.month,
          //     labaSetelahPajak.lsp_rkap,
          //     labaSetelahPajak.lsp_prognosa,
          //     labaSetelahPajak.lsp_realisasi
          //   ], function(err, queryResult){
          //   if(err){
          //     console.log(err);
          //     reject(err);
          //   } else {
          //     resolve(queryResult);
          //   }
          //
          // });
        }
      };

      models.Lsp.destroy(
        {
          where: { year: theYear },
        })
      .then(() => {
        insertToDb(labaSetelahPajak);
      })
      .catch((err) => {
        reject(err);
      });

      // db.query(
      // 'DELETE FROM lsp WHERE year = ?',
      // [theYear],
      // function (err, queryResult) {
      //   if(err){
      //     console.log(err);
      //     reject(err);
      //   }else{
      //     insertToDb(labaSetelahPajak);
      //   }
      // });
    });
};

const readClaim = (fileName, db, theYear) => (
  new Promise((resolve, reject) => {
    const workbook = XLSX.readFile(fileName);
    const firstSheetName = workbook.SheetNames[RINCIAN_SHEET_POSITION];
    const worksheet = workbook.Sheets[firstSheetName];

    const getData = (cellName, ws) => (ws[cellName] ? ws[cellName].v : 0);
    const ok = getData('DV10', worksheet);
    const op = getData('DW10', worksheet);
    const lk = getData('DX10', worksheet);

    models.Claim.destroy({
      where: { year: theYear },
    })
    .then(() => {
      models.Claim.create({
        year: theYear,
        ok,
        op,
        lk,
      })
      .then(() => {
        resolve();
      })
      .catch((errCreate) => {
        console.log(errCreate);
      });
    })
    .catch((err) => {
      reject(err);
    });

    // db.query(
    // 'DELETE FROM claim WHERE year = ?',
    // [theYear],
    // (err) => {
    //   if (err) {
    //     console.log(err);
    //     reject(err);
    //   } else {
    //     db.query('INSERT INTO claim (year, ok, op, lk) VALUES (?, ?, ?, ?)',
    //       [theYear, ok, op, lk,
    //       ], (err2, queryResult) => {
    //         if (err2) {
    //           console.log(err);
    //           reject(err);
    //         } else {
    //           resolve(queryResult);
    //         }
    //       });
    //   }
    // });
  })
);
