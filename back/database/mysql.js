// ici on importe mysql
const mysql = require('mysql');

//ici on applique les parametres de connexion:
const mysqlConnection = mysql.createConnection({
    host: 'bdujnlfj9e4qt3hbn3dl-mysql.services.clever-cloud.com',
    database: 'bdujnlfj9e4qt3hbn3dl',
    user: 'usbfddmz2brab5up',
    password: 'ZBX0j8vl9T575ScL5b8A',
});
//console.log('pouet pouet');


// maintenant qu'on a les bons parametres, on se connecte
mysqlConnection.connect((err) => {
    if (err) {
        //console.log('oups');
        console.log(`erreur de connexion: ${err.stack}`)
    } else {
        //console.log('yes !!');
        console.log('connexion effectuée à la base de données')
        //console.log(mysqlConnection);
    }
})

// et on exorte le tout
module.exports = mysqlConnection;
