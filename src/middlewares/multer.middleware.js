import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")  //cb callback & path to destination where to keep all the files
    },
    filename: function (req, file, cb) { // unique filename for pro project
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.originalname)
    }
  })
  
export  const upload = multer({ 
    storage
})