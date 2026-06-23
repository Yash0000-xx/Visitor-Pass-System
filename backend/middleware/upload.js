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
        let newName = 'file-' + Date.now() + fileExt;
        cb(null, newName);
    }
});

const upload = multer({ storage: customStorage });

module.exports = upload;