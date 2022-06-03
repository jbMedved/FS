const express = require('express');
const router = express.Router();

// ici on importe les fonctions stockées dans controllers/user.js
const userCtrl = require('../controllers/user');

// ici c'est pour créer le compte utilisateur
router.post('/signup', userCtrl.signup);

// ici c'est pour se connecter au compte utilisateur
router.post('/login', userCtrl.login);

// ici c'est pour recuperer l'id depuis le token
router.get('/me', userCtrl.recupId);


//et on exporte le tout
module.exports = router;