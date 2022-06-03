// on "appelle" express
const express = require('express');

// la constante app qui appelle la mehode express
const app = express();

// on importe le module de gestion des repertoires
const path = require('path');

// on importe notre router pour les posts
const postRoutes = require('./routes/post')

// on importe notre router pour les users
const userRoutes = require('./routes/user')

// ici on fera appel a notre base de données SQL
const mysql = require('./database/mysql')

//ici on met en place l'agent de sécurité : CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// intercepte les requetes qui contiennent du JSON et l'envoie sur le req
app.use(express.json());

//pour tout ce qui passe par la racine api/post, 
//utiliser la logique contenue dans routes/post.js
app.use('/api/post', postRoutes);

//pour tout ce qui passe par la racine api/auth, 
//utiliser la logique contenue dans routes/user.js
app.use('/api/auth', userRoutes);

// app.use('/medias', express.static(path.join(__dirname, 'medias')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// on exporte la constante app pour s'en servir dans d'autres fichiers
module.exports = app;