// ici on importe mysql
const mysql = require('mysql');

// on definit les parametres de connexion:
let dbConfig = {
    host: 'bdujnlfj9e4qt3hbn3dl-mysql.services.clever-cloud.com',
    database: 'bdujnlfj9e4qt3hbn3dl',
    user: 'usbfddmz2brab5up',
    password: 'ZBX0j8vl9T575ScL5b8A',
};
// ici on applique les parametres de connexion:
const mysqlConnection = mysql.createConnection(dbConfig);

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

// pour faire face aux deconnexions intempestives toutes les 5 minutes,
// je relance la connexion toutes les 4.5 minutes
// setInterval(mysqlConnection.connect, 270000);
// setInterval(mysqlConnection, 270000);
// ==> echec


// et on exorte le tout
module.exports = mysqlConnection;
