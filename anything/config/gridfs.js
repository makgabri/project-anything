'use strict';

const config = require('./config');
const GridFsStorage = require("multer-gridfs-storage");
  

/**     Loading gridfs     **/
module.exports = new GridFsStorage({
    url: config.mongo.url,
    options: { useNewUrlParser: true, useUnifiedTopology: true},
    file: function(req, file) {
        return {      
            bucketName: 'uploads',       
            //Setting collection name, default name is fs      
            filename: file.originalname,     
            //Setting file name to original name of file    
        }
    }
})