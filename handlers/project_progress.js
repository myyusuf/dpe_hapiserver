const Path = require('path');
const Fs = require('fs');

const DPEConstant = require('../config/dpe_constant.js');
const ExcelReader = require('./excelreader');
const PiutangExcelReader = require('./excel_reader/piutang');
const ProyeksiExcelReader = require('./excel_reader/proyeksi');

exports.upload = function(request, reply){
  // console.log(JSON.stringify(request.payload));

  const fileData = request.payload.progress;
  const targetPath = DPEConstant.FILE_UPLOAD_DIR + fileData.filename; // Path.join(__dirname, Path.basename(request.payload.upload.filename));
  const tempPath = fileData.path;

  Fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      throw err;
    }

    const callback = (result) => {
      reply(result);
    };
    // ExcelReader.readExcel(targetPath, this.db, callback);
    PiutangExcelReader.readExcel(targetPath, this.db)
    .then((result) => {
      reply(result);
    });
    // ProyeksiExcelReader.readExcel(targetPath, this.db)
    // .then((result) => {
    //   reply(result);
    // });
  });
};
