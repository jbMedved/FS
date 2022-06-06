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
        console.log('oups');
        console.log(`erreur de connexion: ${err.stack}`)
    } else {
        //console.log('yes !!');
        console.log('connexion effectuée à la base de données')
        //console.log(mysqlConnection);
    };
    //     setTimeout(function () {
    //         console.log("connexion finie");
    //         mysqlConnection.end;
    //     }, 10000);
})

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// nouveau test de connexion mysql (31/05/22) -> trouvé sur youtube
// mysqlConnection.connect();
// mysqlConnection.on('connect', function () {
//     console.log("connexion OK");
//     setTimeout(function () {
//         mysqlConnection.end;
//     }, 1000);
// })
// mysqlConnection.on('end', function () {
//     console.log("connexion finie");
// })

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// nouveau test de connexion mysql (31/05/22) -> trouvé sur sudoall.com
// let i = 0;
// let mysqlConnection;
// function handleDisconnect() {
//     mysqlConnection = mysql.createConnection(dbConfig);
//     mysqlConnection.connect(function (err) {              // The server is either down
//         if (err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//         } else {
//             console.log("connexion OK");
//             i++;
//             console.log(i);
//         }                                  // to avoid a hot loop, and to allow our node script to
//     });                                     // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     mysqlConnection.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                 // server variable configures this)
//         }
//     });
// }

// handleDisconnect();
//  ===> ca ne resoud pas mes soucis de deconnexion mais ca reconnecte ensuite


// et on exporte le tout
module.exports = mysqlConnection;

/////////////////////////////////////////////////////////////////////////
// ici on va utiliser des parametres de connexion pour mysql Workbench //
/////////////////////////////////////////////////////////////////////////

// const conn = mysql.createConnection({
//     conn.connect();
//     conn.query(),
//     conn.end()
// })

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: localhost,
//     user: root,
//     password: Melina0701,
//     database: groupomania
// })

// module.exports = pool;







