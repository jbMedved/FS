// on va appeler notre utilitaire de cyptage des mots de passe : BCRYPT
const bcrypt = require('bcrypt');

// on importe notre utilisatire pour la gestion des tokens : JSONWEBTOKEN
const jwt = require('jsonwebtoken');

// on importe la BDD mysql
const mysqlConnection = require('../database/mysql');

//pour créer un compte utilisateur
exports.signup = (req, res, next) => {
    console.log('go sign up');
    // regexPassword = /^(?=.{8,}$)(?=(?:.*?[A-Z]))(?=.*?[a-z])(?=(?:.*?[0-9])).*$/g
    // const motDePasse = req.body.password
    // if (motDePasse.match(regexPassword) == null) {
    //     return(`le mot de passe doit avoir au moins:
    //     - 1 Majuscule
    //     - 1 Minuscule
    //     - 1 chiffre
    //     - 8 caracteres`)
    // }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log(hash);
            console.log(req);
            const user = {
                email: req.body.email,
                password: hash,
                pseudo: req.body.firstName + ' ' + req.body.lastName //req.body.pseudo 
            };

            mysqlConnection.query(
                'INSERT INTO user SET ?', user, (error, results) => {
                    if (error) {
                        console.log('aie dans signup')
                        console.log(error);
                        res.json({ error });
                    } else {
                        console.log(results)
                        res.json({ message: 'utilisateur créé' });
                    }
                }
            )
        })
        .catch(err => res.status(500).json({ message: "a tout cassé" }));
};


//pour se connecter à un compte existant
exports.login = (req, res, next) => {
    console.log(req.body);

    const email = req.body.email;

    mysqlConnection.query(
        'SELECT * FROM user WHERE email = ? ', email, (error, results) => {
            if (error) {
                console.log('aie login');
                console.log('error');
                res.json({ error });
            } else {
                console.log('youpi');
                //console.log(results);

                if (results == 0) {
                    console.log('ya personne');
                    return res.status(404).json({ error: "utilisateur inexistant" })
                }

                //console.log(results[0].password);
                bcrypt.compare(req.body.password, results[0].password)

                    .then(valid => {
                        // console.log(req.body.password);
                        // console.log(results[0].password);
                        if (!valid) {
                            return res.status(401).json({ error: "mauvais mot de passe" });
                        }
                        //console.log(valid);
                        console.log('le pwd est bon');
                        res.status(200).json({
                            userId: results[0].id,
                            token: jwt.sign(
                                { userId: results[0].id },
                                'M0nSup3rT0k3n',
                                { expiresIn: '12h' }
                            )
                        });
                    })
                    .catch(err => res.status(500).json({ error: `souci bcrypt: ${err}` }));
            }
        }
    )
};
