//photos.js
var express = require('express');
var router = express.Router();
var app = express();
var multer = require('multer');
var photoController = require('../controllers/photoController');
var flash = require('express-flash');

//create upload object- intialize
var upload = multer({
  storage: photoController.storage,
  fileFilter: photoController.imageFilter
});

//Photo model import is required
var Photo = require('../models/photoModel');

//flash messaging
router.use(flash());

//LIST - Get request to search database for our photos
router.get('/', (req, res, next)=>{
//search the DB for the photos
  Photo.find({})
    .then((photos)=>{
//call photos view
      res.render('photos', {
        photos : photos,
        flashMsg: req.flash("fileUploadError")
    });
  })
  .catch((err)=>{
    if (err) {
      res.end("ERROR!");
    }
  });
});

//FIND - route for getting photo Details with form for editing
router.get('/:photoid', (req, res, next)=>{
  console.log("finding "+req.params.photoid);
  Photo.findOne({'_id': req.params.photoid})
//return promoise then handle it to render photo
    .then((photo)=>{
      res.render('updatePhoto', {
        photo: photo,
        flashMsg: req.flash("photoFindError")
      });
    }).catch((err)=>{
      if (err) console.log(err);
    });
});

//DELETE - route for deleting the photos
router.delete('/delete/:photoid', function(req, res){
  Photo.findByIdAndRemove({'_id': req.params.photoid})
  .then((photos) => {
      res.redirect('/photos');
  });
});

//UPDATE - route for posting newly updated details
router.post('/:photoid', (req, res, next)=>{
  Photo.findOne({'_id': req.params.photoid})
//return promoise then set photo data details
    .then((photo)=>{
      var data = {
          title: req.body.title,
          description: req.body.description
          }
//set the data, save the photo details and redirect to photo list
      photo.set(data);
      photo.save().then(()=>{
        res.redirect('/photos');
      });
    })
    .catch((err)=>{
      if (err) console.log(err);
  });
});

//CREATE - post fields to the server and save them
router.post('/', upload.single('image'), (req, res, next)=>{
  var path = "/static/img/" + req.file.filename;
  var photo = {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    imageurl: path,
    title: req.body.title,
    filename: req.file.filename,
    description: req.body.description,
    size: req.file.size / 1024 | 0
  }
//Saving photo to DB
  var photo = new Photo(photo);
  photo.save()
    .then(()=>{
      //redirect after save, if succesfull
      res.redirect('/photos');
    })
    //Catch error  logs error
    .catch((err)=>{
      if (err){
        console.log(err);
        throw new Error("PhotoSaveError", photo);
      }
    });
});

//function will get called if above gets unhandled error - flash to display image and redirect
router.use(function(err, req, res, next){
  console.error(err.stack);
  if (err.message == "OnlyImageFilesAllowed"){
      req.flash('fileUploadError', "Please select an image file with jpg, png, or gif")
      res.redirect('/photos');
//2nd condition error if there was a problem saving
  } else if (err.message == "PhotoSaveError"){
    req.flash('photoSaveError', "There was a problem saving the photo")
    res.redirect('/photos');
  } else{
    next(err);
  }
});

//export the module
module.exports = router;
