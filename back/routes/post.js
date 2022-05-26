const express = require('express');
const router = express.Router();

// ici on importe les fonctions CRUD des posts stockées
// dans controllers/post.js pour les intégrer aux routes
const postCtrl = require('../controllers/post');

// on importe la logique d'authentification pour permettre de sécuriser nos routes
const auth = require('../middleware/auth');

// on importe la logique de gestion de fichiers
const multer = require('../middleware/multer-config');

// ici c'est pour créer un post
router.post('/', auth, multer, postCtrl.createPost);

// ici c'est pour afficher TOUS les posts
router.get('/', auth, postCtrl.getAllPosts);

// ici c'est pour afficher un post en particulier
router.get('/:id', auth, postCtrl.getOnePost);

// ici c'est pour modifier un post
router.put('/:id', auth, multer, postCtrl.modifyPost);

// ici c'est pour supprimer un post
router.delete('/:id', auth, postCtrl.deletePost);

// on exporte le tout
module.exports = router;