// ici on importe mysql
const mysql = require('mysql');
/////////////////////////////////////////////
// on definit les parametres de connexion: //
/////////////////////////////////////////////

// // clever cloud
// let dbConfig = {
//     host: 'bdujnlfj9e4qt3hbn3dl-mysql.services.clever-cloud.com',
//     database: 'bdujnlfj9e4qt3hbn3dl',
//     user: 'usbfddmz2brab5up',
//     password: 'ZBX0j8vl9T575ScL5b8A',
// };

//mysqlworkbench
let dbConfig = {
    host: 'localhost',
    database: 'groupomania',
    user: 'root',
    password: 'Melina0701',
    // port: "3306",
};

//////////////////////////////////////////////////
// ici on applique les parametres de connexion: //
//////////////////////////////////////////////////
const mysqlConnection = mysql.createConnection(dbConfig);

// maintenant qu'on a les bons parametres, on se connecte
mysqlConnection.connect((err) => {
    if (err) {
        // console.log('oups');
        console.log(`erreur de connexion: ${err.stack}`)
    } else {

        console.log('connexion effectuée à la base de données')

    };

})

module.exports = mysqlConnection;























