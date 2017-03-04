const Path = require('path');
const Fs = require('fs');

var DPEConstant = require('../config/dpe_constant.js');
const ExcelReader = require('./excelreader');

exports.upload = function(request, reply){
  // console.log(JSON.stringify(request.payload));

  var fileData = request.payload.progress;
  const targetPath = DPEConstant.FILE_UPLOAD_DIR + fileData.filename;//Path.join(__dirname, Path.basename(request.payload.upload.filename));
  const tempPath = fileData.path;

  Fs.rename(tempPath, targetPath, (err) => {
      if (err) {
          throw err;
      }
      reply({ status: 'ok' });

      ExcelReader.readExcel(targetPath, this.db);
  });
}
