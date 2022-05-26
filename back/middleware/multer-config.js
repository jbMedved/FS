// ici on met en place la possibilité de stocker des medias
// tels que des images ou des videos

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'video/mp4': 'mp4',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'medias')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now + '.' + extension);
    }
})

module.exports = multer({ storage }).single('image');

