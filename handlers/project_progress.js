const Path = require('path');
const Fs = require('fs');

var DPEConstant = require('../config/dpe_constant.js');

exports.upload = function(request, reply){
  // console.log('request.payload.name : ' + request.payload.name);
  // reply(request.payload);

  var fileData = request.payload.progress;
  const targetPath = DPEConstant.FILE_UPLOAD_DIR + fileData.filename;//Path.join(__dirname, Path.basename(request.payload.upload.filename));
  const tempPath = fileData.path;

  Fs.rename(tempPath, targetPath, (err) => {
      if (err) {
          throw err;
      }
      reply({ status: 'ok' });
  });
}
