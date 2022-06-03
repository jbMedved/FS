// // ici on met en place la possibilité de stocker des medias
// // tels que des images ou des videos

// const multer = require('multer');
// console.log('multer : ON');
// const MIME_TYPES = {
//     // 'image/jpg': 'jpg',
//     // 'image/jpeg': 'jpeg',
//     // 'image/png': 'png',
//     // 'video/mp4': 'mp4',
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/webp': 'webp',
//     'image/gif': 'gif',
//     // 'video/x-msvideo': 'avi',
//     // 'video/mp4': 'mp4',
//     // 'video/mpeg': 'mpeg',
//     // 'video/ogg': 'ogv',
//     // 'video/mp2t': 'ts',
//     // 'video/webm': 'webm',
//     // 'video/3gpp': '3gp',
//     // 'video/3gpp2': '3g2'
// }
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'medias')
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension);
//     }
// });
// console.log('multer : OFF')

// module.exports = multer({ storage }).single('image');

//////////////////////////////////////////////////////////////////////

const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');


