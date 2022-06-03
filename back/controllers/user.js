// on va appeler notre utilitaire de cyptage des mots de passe : BCRYPT
const bcrypt = require('bcrypt');

// on importe notre utilisatire pour la gestion des tokens : JSONWEBTOKEN
const jwt = require('jsonwebtoken');

// on importe le modele User.js
const User = require('../models/User');

// on importe la BDD mysql
const mysqlConnection = require('../database/mysql');



//////////////////////////////////////
// pour créer un compte utilisateur //
//////////////////////////////////////
exports.signup = (req, res, next) => {

    // on récupere l'email, le mot de passe, le nom et le prénom
    const { email, password, LastName, FirstName } = req.body

    //on veut  que l'adresse mail saisie soit l'adresse mail pro
    // regexMail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/g;
    // regexPassword = /^(?=.{8,}$)(?=(?:.*?[A-Z]))(?=.*?[a-z])(?=(?:.*?[0-9])).*$/g;
    // const mail = req.body.email;
    // const motDePasse = req.body.password;
    // if (mail.match(regexMail) == null) {
    // console.log('veuillez saisir votre email professionnel svp')
    // emailErrorMsg.innerHTML = 'veuillez saisir votre email professionnel svp'
    // on veut que le mot de passe aie un minimum de sécurité
    // }else if (motDePasse.match(regexPassword) == null) {
    //     console.log(`le mot de passe doit avoir au moins:
    //     - 1 Majuscule
    //     - 1 Minuscule
    //     - 1 chiffre
    //     - 8 caracteres`)
    // passwordErrorMsg.innerHTML = `le mot de passe doit avoir au moins:
    //      - 1 Majuscule
    //      - 1 Minuscule
    //      - 1 chiffre
    //      - 8 caracteres`
    // } else {

    // on hash le mot de passe pour eviter qu'il transite en "clair"    
    bcrypt.hash(password, 10)
        .then(hash => {
            // on construit le compte utilisateur en fonction du modele User.js
            const user = new User(email, hash, LastName, FirstName)
            mysqlConnection.query(
                'INSERT INTO user SET ?', user, (error, results) => {
                    if (error) {
                        res.json({ error });
                    } else {
                        res.json({ message: 'utilisateur créé' });
                    }
                }
            )
        })
        .catch(err => res.status(500).json({ message: `a tout cassé: ${err}` }));
};


////////////////////////////////////////////
// pour se connecter à un compte existant //
////////////////////////////////////////////
exports.login = (req, res, next) => {
    // on récupere l'email, le mot de passe, le nom et le prénom
    const { email, password, } = req.body;
    mysqlConnection.query(
        'SELECT * FROM user WHERE email = ? ', email, (error, results) => {
            if (error) {
                res.json({ error });
            } else {
                console.log('vérifions si le compte existe');
                // si pas de resultat, alors pas de compte existant
                if (results == 0) {
                    console.log('ya personne');
                    return res.status(404).json({ error: "utilisateur inexistant" })
                }
                // sinon, on va comparer maintenant le mot de passe
                bcrypt.compare(password, results[0].password)
                    // si le mot de passe est different
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: "mauvais mot de passe" });
                        }
                        // si le mot de passe correspond
                        console.log('le pwd est bon');
                        console.log(results[0]);
                        res.status(200).json({
                            userId: results[0].id,
                            token: jwt.sign(
                                { userId: results[0].id },
                                'SECUREKEY',
                                { expiresIn: '12h' }
                            ),
                            pseudo: results[0].pseudo
                        });
                    })
                    .catch(err => res.status(500).json({ error: `souci bcrypt: ${err}` }));
            }
        }
    )
};

//////////////////////////////////////////
// test pour fetch l'id depuis le token //
//////////////////////////////////////////
exports.recupId = function (req, res) {
    // on trouve l'id utilisateur depuis le token
    if (req.headers && req.headers.authorization) {
        // console.log('req.headers.authorization')
        // console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1];
        // console.log("token");
        // console.log(token);
        const decodedToken = jwt.verify(token, 'SECUREKEY');
        // console.log("decodedToken");
        // console.log(decodedToken);
        const idFound = decodedToken.userId;
        // console.log("idFound");
        // console.log(idFound);
        try {
            // console.log("on a l'id lié au TOKEN")
            res.status(200).json({ idFound });
        } catch (e) {
            console.log("souci pour retrouver l'id depuis token")
            return res.status(401).send('unauthorized');
        }
        // on a l'id 
    } else {
        return res.send(500);
    }
}