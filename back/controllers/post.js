//ici on importe notre modele des posts pour la base de données
//const Post = require('../models/Post');

// on importe l'outil de gestion des fichiers
const fs = require('fs');

// ici on a les fonctions CRUD avec un nom de fonction évident

// ici la création de post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post)
    delete postObject._id;
    const post = new Post({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: "post créé" }))
        .catch(error => res.status(400).json({ error }));
};

// ici l'affichage des posts
exports.getAllPosts = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }))
};

// ici l'affichage d'un post 
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }))
};

//ici la modification  d'un post
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
        } : { ...req.body };
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'post modifié' }))
        .catch(error => res.status(404).json({ error }))
};

// ici la suppression d'un post
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            const filename = thing.imageUrl.split('/medias/')[1];
            fs.unlink(`medias/${filename}`, () => {
                Post.findOne({ _id: req.params.id })
                    .then((post) => {
                        if (!post) {
                            return res.status(404).json({ error: new Error('post introuvable') })
                        };
                        if (post.userId !== req.auth.userId) {
                            return res.status(401).json({ error: new Error('requete non autorisée') })
                        }
                        Post.deleteOne({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'post supprimé' }))
                            .catch(error => res.status(404).json({ error }))
                    })
            })
        })
        .catch(error => res.status(404).json({ error }))

};

