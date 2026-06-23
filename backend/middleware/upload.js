const multer = require('multer');
const path = require('path');
const fs = require('fs');

const myFolder = './uploads';

if (!fs.existsSync(myFolder)) {
    fs.mkdirSync(myFolder);
}

const customStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, myFolder);
    },
    filename: function(req, file, cb) {
        let fileExt = path.extname(file.originalname);
        let newName = 'visitor-photo-' + Date.now() + fileExt;
        cb(null, newName);
    }
});

  const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime) {
        return cb(null, true);
    } else {
        cb(new Error('Security Error: Only JPG and PNG image files are allowed!'), false);
    }
};


const upload = multer({ 
    storage: customStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: imageFilter
});

module.exports = upload;