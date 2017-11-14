'use strict';

var XLSX = require('xlsx');

const INPUTAN_SHEET_POSITION = 0;
const RINCIAN_SHEET_POSITION = 1;

exports.readExcel = function (fileName, db, callback) {

  const workbook = XLSX.readFile(fileName);
  const worksheet = workbook.Sheets[workbook.SheetNames[INPUTAN_SHEET_POSITION]];

  const yearCellValue = worksheet['F6'].v;
  const YEAR = 2017;//parseInt(yearCellValue.match(/[0-9]+/)[0], 10);

  db.query(
  'DELETE FROM project_progress WHERE year = ?',
  [YEAR],
  function (err, queryResult) {
    if(err){
      res.status(500).send('Error while doing operation.');
    }else{
      getExistingProjectCodes(db)
      .then((existingProjectCodes) => {
        readExcel1(fileName, db, YEAR, existingProjectCodes)
        .then((results) => {
          readExcel2(fileName, db, YEAR)
          .then((result) => {
            readClaim(fileName, db, YEAR)
            .then((result) => {
              callback({
                status: 'OK'
              });
            })
          })
          .catch((err) => {
            callback({
              status: 'UNKNOWN_ERROR',
              payload: err.message
            });
          });
        }).catch((errx) => {
          console.log(errx);
          callback({
            status: 'ERROR',
            payload: err.payload
          });
        })
      })
      .catch((erry) => {
        callback({
          status: 'UNKNOWN_ERROR',
          payload: err.message
        });
      });
    }
  });
}

const getExistingProjectCodes = (db) => {

  return new Promise((resolve, reject) => {
    db.query(
    'SELECT code FROM project',
    [],
    function (err, rows) {
      if(err){
        reject(err);
      }else{
        const projectCodes = rows.map((row) => {
          return row.code;
        });
        resolve(projectCodes);
      }
    });
  });

}

var readExcel1 = function (fileName, db, theYear, existingProjectCodes) {

  return new Promise((resolve, reject) => {
    // const fileName = '/Users/myyusuf/Documents/Projects/WIKA/PCD/Dashboard/Documents/KK_HU_DPE_2017.xlsx';
    const workbook = XLSX.readFile(fileName);

    const first_sheet_name = workbook.SheetNames[INPUTAN_SHEET_POSITION];//= 'INPUTAN';
    // console.log(first_sheet_name);
    const worksheet = workbook.Sheets[first_sheet_name];

    const projectProgresses = [];

    const colNames = ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR'
    ];

    console.log('---------------->', theYear);

    const getProjectProgress = function(projectCode, row, month, year, ws) {

      var cellMonthPositionInit = (month-1) * 3;
      var cellName = colNames[cellMonthPositionInit] + row;
      var rkapOk = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      var prognosaOk = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      var realisasiOk = worksheet[cellName]? worksheet[cellName].v : 0;

      cellMonthPositionInit++;
      cellName = colNames[cellMonthPositionInit] + row;
      var rkapOp = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      var prognosaOp = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      var realisasiOp = worksheet[cellName]? worksheet[cellName].v : 0;

      cellMonthPositionInit++;
      cellName = colNames[cellMonthPositionInit] + row;
      var rkapLk = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 1);
      var prognosaLk = worksheet[cellName]? worksheet[cellName].v : 0;
      cellName = colNames[cellMonthPositionInit] + (row + 2);
      var realisasiLk = worksheet[cellName]? worksheet[cellName].v : 0;

      const projectProgress = {
        month: month,
        year: year,
        projectCode: projectCode,
        rkapOk: rkapOk,
        rkapOp: rkapOp,
        rkapLk: rkapLk,
        prognosaOk: prognosaOk,
        prognosaOp: prognosaOp,
        prognosaLk: prognosaLk,
        realisasiOk: realisasiOk,
        realisasiOp: realisasiOp,
        realisasiLk: realisasiLk
      }

      return projectProgress;
    }

    for(var row=11; row<500; row++){
      let projectCode = worksheet['C' + row]? worksheet['C' + row].v : '';

      if(projectCode != ''){

        if(projectCode == 'END'){
          break;
        }

        projectCode = projectCode.trim();

        for(var month=1; month<=12; month++){
          const tmpProjectProgress = getProjectProgress(projectCode, row, month, theYear, worksheet);
          projectProgresses.push(tmpProjectProgress);
        }

        row += 2;
      }
    }

    const promises = [];
    const unrecoredProjectProgresses = projectProgresses.filter((projectProgress) => {
      return !existingProjectCodes.includes(projectProgress.projectCode);
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

    for(var i=0; i<projectProgresses.length; i++) {

      var projectCode = projectProgresses[i].projectCode;
      var year = projectProgresses[i].year;
      var month = projectProgresses[i].month;

      var rkapOk = projectProgresses[i].rkapOk;
      var rkapOp = projectProgresses[i].rkapOp;
      var rkapLk = projectProgresses[i].rkapLk;

      var realisasiOk = projectProgresses[i].realisasiOk;
      var realisasiOp = projectProgresses[i].realisasiOp;
      var realisasiLk = projectProgresses[i].realisasiLk;

      var prognosaOk = projectProgresses[i].prognosaOk;
      var prognosaOp = projectProgresses[i].prognosaOp;
      var prognosaLk = projectProgresses[i].prognosaLk;

      var query = 'INSERT INTO project_progress (project_id, year, month, rkap_ok, rkap_op, rkap_lk, ' +
      'realisasi_ok, realisasi_op, realisasi_lk, prognosa_ok, prognosa_op, prognosa_lk) ' +
      'SELECT id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? FROM project WHERE code = ? ';

      promises.push(new Promise((resolve2, reject2) => {
        db.query(query, [
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
          projectCode], function(err, result){
          if(err){
            // console.log(err);
            reject2(err);
          }else{
            resolve2({
              affectedRows: result.affectedRows,
              projectCode: projectCode
            });
          }
        });
      }));

    }

    Promise.all(promises)
    .then((results) => {
      resolve(results);
    })
    .catch((err) => {
      reject(err);
    })

    // readExcel3(fileName, db);
  });
};

var readExcel2 = function (fileName, db, theYear) {
    return new Promise((resolve, reject) => {
      var workbook = XLSX.readFile(fileName);

      var first_sheet_name = workbook.SheetNames[RINCIAN_SHEET_POSITION];//= 'Lap';
      var worksheet = workbook.Sheets[first_sheet_name];

      var labaSetelahPajak = [];

      var getData = function(cellName, ws){

        return ws[cellName]? ws[cellName].v : 0;
      }

      for(var row=8; row<150; row++){
        var name = worksheet['C' + row]? worksheet['C' + row].v : '';

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

      var insertToDb = function(labaSetelahPajakArray){
        for(var i=0; i<labaSetelahPajakArray.length; i++){

          var labaSetelahPajak = labaSetelahPajakArray[i];
          console.log('Insert labaSetelahPajak : ' + JSON.stringify(labaSetelahPajak));

          const query = 'INSERT INTO lsp (year, month, lsp_rkap, lsp_prognosa, lsp_realisasi) ' +
          'VALUES (?, ?, ?, ?, ?)';

          db.query(query,
            [
              labaSetelahPajak.year,
              labaSetelahPajak.month,
              labaSetelahPajak.lsp_rkap,
              labaSetelahPajak.lsp_prognosa,
              labaSetelahPajak.lsp_realisasi
            ], function(err, queryResult){
            if(err){
              console.log(err);
              reject(err);
            } else {
              resolve(queryResult);
            }

          });
        }
      }

      db.query(
      'DELETE FROM lsp WHERE year = ?',
      [theYear],
      function (err, queryResult) {
        if(err){
          console.log(err);
          reject(err);
        }else{
          insertToDb(labaSetelahPajak);
        }
      });
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

    db.query(
    'DELETE FROM claim WHERE year = ?',
    [theYear],
    (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        db.query('INSERT INTO claim (year, ok, op, lk) VALUES (?, ?, ?, ?)',
          [theYear, ok, op, lk,
          ], (err2, queryResult) => {
            if (err2) {
              console.log(err);
              reject(err);
            } else {
              resolve(queryResult);
            }
          });
      }
    });
  })
);
