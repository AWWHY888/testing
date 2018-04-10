//Module for application logic that is associated with photo processing

var multer = require('multer');
var Photo = require('../models/photoModel');

/*set diskstorage location to use public/img and unique string name for photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


//comment above so it doesn't write locally - or create directory on db*/

//use imagefilter to filter photos we're taking in
const imageFilter = function (req, file, cb) {
  //if filename matches condition, then return true
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    cb(null, true);
  } else{
    cb(new Error("OnlyImageFilesAllowed"), false)
  }
}

class PhotoService{
  // list
  static list(){
    return Photo.find({})
      .then((photos)=>{
        // found
        return photos;
      });
  }

  // find
  static read(id){
    return Photo.findById(id)
      .then((photo)=>{
        //found
        return photo;
      });
  }

  // create

  // update

  // delete

}
//commnet modules storage
module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.PhotoService = PhotoService;
