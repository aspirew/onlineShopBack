const multer = require('multer')
const express = require('express')

const storage = multer.diskStorage({
    destination: './assets',
    filename: (req, file, cb) => {
      var filetype = '';
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      else if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      else{
        cb(new Error("Only jpg or png images allowed"))
        return
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

module.exports = {

  upload: multer(
    {storage: storage,
    limits:{
      fileSize: 1024 * 1024
    }
  }),

  imageUpload : (req, res, err) => {
    console.log(req.file.filename)
    if(err instanceof multer.MulterError){
      res.json({
        success: false,
        name: null,
			  message: "Failed to upload a file"
      })
    }
    else {
      res.json({
      success: true,
      name: req.file.filename,
			message: "New image uploaded"
		})
  }

  },

  getImage : (req, res) => {
    const app = express()
    const path = require('path');
    app.use('/img', express.static(__dirname + '/assets'));
    res.sendFile(path.resolve('assets/' + req.params.name))
  }

}