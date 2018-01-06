exports.process = batchData => (
  new Promise((resolve, reject) => {
    const YEAR = batchData.year;
    const MONTH = batchData.month;
    const payload = batchData.payload;
    console.log(payload);
    resolve({
      status: 'OK',
    });
  })
);
