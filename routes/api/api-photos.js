//photos.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
var photoController = require('../../controllers/photoController');
var upload = multer({
  storage: photoController.storage,
  fileFilter: photoController.imageFilter
});

//import PhotoService
const PhotoService = photoController.PhotoService;

// photos - list
router.get('/', (req, res, next)=>{
  PhotoService.list()
  //returns promise - argument passed photos
    .then((photos)=>{
      console.log(`API: Found images: ${photos}`);
      res.status(200);
      //set content type header to application/json - set correct mime type
      res.set({'Content-type':'application/json'});
      res.send(JSON.stringify(photos));
    });
})

// photos/:photoid - find
router.get('/:photoid', (req, res, next)=>{
  PhotoService.read(req.params.photoid)
  //returns promise - argument passed photos
    .then((photo)=>{
      console.log(`API: Found images: ${photo}`);
      res.status(200);
      //set content type header to application/json - set correct mime type
      res.set({'Content-type':'application/json'});
      res.send(JSON.stringify(photo));
    }).catch((err)=>{
  });
});



// /photos POST create

// /photos/photoid: PUT - update

// /photos/photoid: DELETE - delete

module.exports = router;
