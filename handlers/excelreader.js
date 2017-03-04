'use strict';

var XLSX = require('xlsx');

exports.readExcel = function (fileName, db) {

  const year = 2017;

  db.query(
  'DELETE FROM project_progress WHERE year = ?',
  [year],
  function (err, queryResult) {
    if(err){
      res.status(500).send('Error while doing operation.');
    }else{
      readExcel1(fileName, db);
    }
  });
}

var readExcel1 = function (fileName, db) {

    // const fileName = '/Users/myyusuf/Documents/Projects/WIKA/PCD/Dashboard/Documents/KK_HU_DPE_2017.xlsx';

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[1];//= 'INPUTAN';
    // console.log(first_sheet_name);
    var worksheet = workbook.Sheets[first_sheet_name];

    var result = [];

    var year = 2017;

    var colNames = ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR'
    ];

    var getProjectProgress = function(projectCode, row, month, year, ws){

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

      var projectProgress = {
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

    for(var row=11; row<17; row++){
      var projectCode = worksheet['C' + row]? worksheet['C' + row].v : '';

      if(projectCode != ''){

        projectCode = projectCode.trim();

        for(var month=1; month<=12; month++){
          var projectProgress = getProjectProgress(projectCode, row, month, year, worksheet);
          result.push(projectProgress);
        }

        row += 2;
      }
    }

    for(var i=0; i<result.length; i++){

      var projectCode = result[i].projectCode;
      var year = result[i].year;
      var month = result[i].month;

      var rkapOk = result[i].rkapOk;
      var rkapOp = result[i].rkapOp;
      var rkapLk = result[i].rkapLk;

      var realisasiOk = result[i].realisasiOk;
      var realisasiOp = result[i].realisasiOp;
      var realisasiLk = result[i].realisasiLk;

      var prognosaOk = result[i].prognosaOk;
      var prognosaOp = result[i].prognosaOp;
      var prognosaLk = result[i].prognosaLk;

      var query = 'INSERT INTO project_progress (project_id, year, month, rkap_ok, rkap_op, rkap_lk, ' +
      'realisasi_ok, realisasi_op, realisasi_lk, prognosa_ok, prognosa_op, prognosa_lk) ' +
      'SELECT id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? FROM project WHERE code = ? ';

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
          console.log(err);
          // res.status(500).send('Error while doing operation, Ex. non unique stambuk');
        }else{
          // res.json({status: 'INSERT_SUCCESS', lastId: res.insertId});
        }

      });
    }

    readExcel2(fileName, db);

};

var readExcel2 = function (fileName, db) {

    // const fileName = '/Users/myyusuf/Documents/Projects/WIKA/PCD/Dashboard/Documents/KK_HU_DPE_2017.xlsx';

    var workbook = XLSX.readFile(fileName);

    var first_sheet_name = workbook.SheetNames[5];//= 'INPUTAN';
    console.log(first_sheet_name);
    var worksheet = workbook.Sheets[first_sheet_name];

    var result = {
      labaSetelahPajak: [],
      labaRugiLain: []
    };

    var year = 2017;

    var colNames = ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR'
    ];

    var getData = function(name, row, month, year, ws){

      var cellMonthPositionInit = (month-1) * 3;
      cellMonthPositionInit += 2;
      var cellName = colNames[cellMonthPositionInit] + row;
      var cellValue = worksheet[cellName]? worksheet[cellName].v : 0;

      var result = {
        month: month,
        year: year,
        cellValue: cellValue
      }

      return result;
    }

    for(var row=8; row<150; row++){
      var name = worksheet['C' + row]? worksheet['C' + row].v : '';

      if(name == 'Laba Setelah Pajak'){
        for(var month=1; month<=12; month++){
          var data = getData(name, row, month, year, worksheet);
          result.labaSetelahPajak.push(data);
        }
      }else if(name == 'Laba/Rugi lain-lain'){
        for(var month=1; month<=12; month++){
          var data = getData(name, row, month, year, worksheet);
          result.labaRugiLain.push(data);
        }
      }
    }

    var insertToDb = function(tmpResult){
      for(var i=0; i<tmpResult.labaSetelahPajak.length; i++){

        var labaSetelahPajak = tmpResult.labaSetelahPajak[i];
        var labaRugiLain = tmpResult.labaRugiLain[i];
        var query = 'INSERT INTO monthly_data (year, month, laba_setelah_pajak, laba_rugi_lain) ' +
        'VALUES (?, ?, ?, ?)';

        db.query(query, [
          labaSetelahPajak.year,
          labaSetelahPajak.month,
          labaSetelahPajak.cellValue,
          labaRugiLain.cellValue], function(err, queryResult){
          if(err){
            console.log(err);
            // res.status(500).send('Error while doing operation, Ex. non unique stambuk');
          }else{

          }

        });
      }
    }

    db.query(
    'DELETE FROM monthly_data WHERE year = ?',
    [year],
    function (err, queryResult) {
      if(err){
        res.status(500).send('Error while doing operation.');
      }else{
        insertToDb(result);
      }
    });
};
