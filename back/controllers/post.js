//ici on importe notre modele des posts pour la base de données
const Post = require('../models/Post');

// on importe l'outil de gestion des fichiers
const fs = require('fs');
const mysqlConnection = require('../database/mysql');

/////////////////////////////////////////////////////////////////
// ici on a les fonctions CRUD avec un nom de fonction évident //
/////////////////////////////////////////////////////////////////

/////////////////////////
// la création de post //
/////////////////////////
// exports.createPost = (req, res, next) => {
//     const postObject = JSON.parse(req.body.post)
//     delete postObject._id;
//     const post = new Post({
//         ...postObject,
//         imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
//     });
//     post.save()
//         .then(() => res.status(201).json({ message: "post créé" }))
//         .catch(error => res.status(400).json({ error }));
// };

exports.createPost = async (req, res) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`;
    const postObject = json.parse(req.body.post);
    const { userId, titre, contenu } = postObject;
    const post = new Post(userId, titre, contenu, imageUrl);
    const values = [userId, titre, contenu, imageUrl];
    try {
        const envoiPost = await mysqlConnection.query(
            `INSERT INTO post(userId, titre, contenu, imageUrl)
            VALUES (?)`, [values],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage des posts");
                    res.json({ error });
                } else {
                    res.status(201).json({ results });
                }
            }
        );
    }
    catch (err) {
        console.log('souci avec createPost')
        res.status(500).json({ error: err });
    }

}

///////////////////////////
// l'affichage des posts //
///////////////////////////

// exports.getAllPosts = (req, res, next) => {
//     Post.find()
//         .then(posts => res.status(200).json(posts))
//         .catch(error => res.status(400).json({ error }))
// };

exports.getAllPosts = async (req, res) => {
    try {
        const lesPosts = await mysqlConnection.query(
            "SELECT * FROM post WHERE ?",
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage des posts");
                    res.json({ error });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    }
    catch (err) {
        console.log('souci avec getAllPosts')
        res.status(500).json({ error: err });
    }
}

///////////////////////////
// l'affichage d'un post //
///////////////////////////

// exports.getOnePost = (req, res, next) => {
//     Post.findOne({ _id: req.params.id })
//         .then(post => res.status(200).json(post))
//         .catch(error => res.status(404).json({ error }))
// };

exports.getOnePost = async (req, res) => {
    try {
        const id = req.params.id;
        const unPost = await mysqlConnection.query(
            "SELECT * FROM post WHERE id= ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage du post");
                    res.json({ error });
                } else {
                    res.status(200).json({ results });
                }
            }
        );
    }
    catch (err) {
        console.log('souci avec getOnePost')
        res.status(500).json({ error: err });
    }
}

////////////////////////////////
// la modification  d'un post //
////////////////////////////////

//     const postObject = req.file ?
//         {
//             ...JSON.parse(req.body.post),
//             imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
//         } : { ...req.body };
//     Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
//         .then(() => res.status(200).json({ message: 'post modifié' }))
//         .catch(error => res.status(404).json({ error }))
// };


exports.modifyPost = async (req, res) => {
    try {
        // 1- on va chercher l'objet
        const id = req.params.id;
        const unPost = await mysqlConnection.query(
            "SELECT * FROM post WHERE id= ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage  pour update du post");
                    res.json({ error });
                } else {
                    res.status(200).json({ results });
                    // 2- a t'on le droit de modifier ce post ?
                    if (userIdParamsUrl == results[0].id  /*||  ou results[0].id est admin*/) {
                        console.log('utilisateur autorisé');
                        // 3- ya t'il un fichier joint?
                        if (req.file) {
                            // 4- identifier le fichier à supprimer
                            const fileName = results[0].imageUrl.split("/medias")[1];
                            // 5- supprimer le fichier remplacé
                            fs.unlink(`media/${filename}`, (error) => {
                                if (error) throw error;
                            })
                        }
                        // 6- on met a jour notre post (avec et sans MAJ image)
                        // const infoPost = JSON.parse(req.body.post);
                        // console.log(infoPost);
                        const postObject = req.file ? {
                            ...JSON.parse(req.body.post),
                            imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
                        } : { ...req.body.post }

                        // 7- on met a jour la BDD
                        const { titre, contenu, imageUrl } = postObject;
                        const sendToDatabase = req.file ?
                            `UPDATE post 
                        SET 
                        titre = ?, 
                        contenu = ?, 
                        imageUrl = ? 
                        WHERE id = ?`
                            :
                            `UPDATE post
                        SET
                        titre = ?, 
                        contenu = ? 
                        WHERE id = ?`
                            ;
                        const values = req.file ?
                            [titre, contenu, imageUrl, id]
                            :
                            [titre, contenu, id]
                            ;
                        mysqlConnection.query(sendToDatabase, values, (error, results) => {
                            if (error) {
                                console.log("souci d'envoi de la maj")
                                res.status(500).json({ error });
                            } else {
                                console.log("maj effectuée")
                                res.status(201).json({ results });
                            }
                        })
                    } else {
                        console.log('modification non autorisée par cet utilisateur');
                        res.status(403).json({ message: "vous n'etes pas autorisé a apporter des modifications" })
                    }
                }
            }
        );
    }
    catch (err) {
        console.log('souci avec createPost')
        res.status(500).json({ error: err });
    }
}

//////////////////////////////
// la suppression d'un post //
//////////////////////////////

//     Post.findOne({ _id: req.params.id })
//         .then(post => {
//             const filename = thing.imageUrl.split('/medias/')[1];
//             fs.unlink(`medias/${filename}`, () => {
//                 Post.findOne({ _id: req.params.id })
//                     .then((post) => {
//                         if (!post) {
//                             return res.status(404).json({ error: new Error('post introuvable') })
//                         };
//                         if (post.userId !== req.auth.userId) {
//                             return res.status(401).json({ error: new Error('requete non autorisée') })
//                         }
//                         Post.deleteOne({ _id: req.params.id })
//                             .then(() => res.status(200).json({ message: 'post supprimé' }))
//                             .catch(error => res.status(404).json({ error }))
//                     })
//             })
//         })
//         .catch(error => res.status(404).json({ error }))
// };

exports.deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        // 1- on va chercher l'objet

        const unPost = await mysqlConnection.query(
        "SELECT * FROM post WHERE id= ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage pour suppression du post");
                    res.json({ error });
                } else {
                    // res.status(200).json({ results });
                    if (results !=0) {
                        console.log("post existant")
                    } else {
                        console.log('post inexistant');
                        return res.status(404).json({error})
                    }
                // 2- a t'on le droit de modifier ce post ?
                    if (userIdParamsUrl == results[0].id  /*||  ou results[0].id est admin*/) {
                        console.log('utilisateur autorisé à supprimer');
                            // 4- identifier le fichier à supprimer
                            const fileName = results[0].imageUrl.split("/medias")[1];
                            // 5- supprimer le fichier remplacé
                            fs.unlink(`media/${filename}`, (error) => {
                                if (error) throw error;
                            })
                            // 6- mettre a jour le post avant suppression
                            const values = [id]
                            // 7- suppression du post
                            mysqlConnection.query(
                            `DELETE FROM post WHERE id = ?`, values, (error, results) => {
                            if (error) {
                                console.log("souci d'envoi de la suppression")
                                res.status(500).json({ error });
                            } else {
                                console.log("suppression effectuée")
                                res.status(201).json({ results });
                            }
                        })
                    } else {
                        console.log('suppression non autorisée par cet utilisateur');
                        res.status(403).json({ message: "vous n'etes pas autorisé a apporter des modifications" })
                    }
                }
            }
        )
    }
    catch (err) {
        console.log('souci avec deletePost')
        res.status(500).json({ error: err });
    }
}