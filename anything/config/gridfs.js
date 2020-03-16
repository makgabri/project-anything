'use strict';

const config = require('./config');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
  

/**     Loading gridfs     **/
module.exports = new GridFsStorage({
    url: config.mongo.url,
    options: { useNewUrlParser: true, useUnifiedTopology: true},
    file: function(req, file) {
        return new Promise(function(resolve, reject) {
            crypto.randomBytes(16, function(err, buf) {
                if (err) {
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                }
                resolve(fileInfo)
            })
      })
    },
})