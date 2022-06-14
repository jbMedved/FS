// ici on importe mysql
const mysql = require('mysql');

// ici on importe nos variables d'environnement
const dotenv = require('dotenv');
const resultat = dotenv.config()


/////////////////////////////////////////////
// on definit les parametres de connexion: //
/////////////////////////////////////////////

//mysqlworkbench
let dbConfig = {
    host: process.env.DB_host,
    database: process.env.DB_schema,
    user: process.env.DB_user,
    password: process.env.DB_pwd,
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























