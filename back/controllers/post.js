//ici on importe notre modele des posts pour la base de données
const Post = require('../models/Post');
const Commentaire = require('../models/Commentaire');

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
    // console.log("req")
    // console.log(req)
    // console.log("req.body")
    // console.log(req.body)
    // console.log("req.body.thing")
    // console.log(req.body.thing)
    // console.log("req.body.post")
    // console.log(req.body.post)
    // console.log("req.auth")
    // console.log(req.auth)
    // console.log("req.auth.userId")
    // console.log(req.auth.userId)
    console.log("req.file")
    console.log(req.file)
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/medias/${req.file.filename}` : "";
    // const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : "";
    console.log("imageUrl")
    console.log(imageUrl)
    //const postObject = JSON.parse(req.body);
    const postObject = req.body;
    // console.log("postObject")
    // console.log(postObject)
    const userId = req.auth.userId
    const { titre, contenu } = postObject;
    // console.log('3')
    console.log("userId")
    console.log(userId)
    // console.log("titre")
    // console.log(titre)
    // console.log("contenu")
    // console.log(contenu)

    const post = new Post(titre, contenu, userId, imageUrl);
    console.log('4')
    console.log(post)
    const values = [userId, titre, contenu, imageUrl];
    try {
        const envoiPost = mysqlConnection.query(
            `INSERT INTO post(userId, titre, contenu, imageUrl)
            VALUES (?)`, [values]
            // (error, results) => {
            //     if (error) {
            //         console.log("erreur dans la requete de creation des posts");
            //         res.json({ error });
            //     } else {
            //         console.log('creation effectuée')
            //         console.log(results)
            //         res.status(201).json({ results: "pouet" });
            //         // console.log("res")
            //         // console.log(res)
            //     }
            // }
        );
        res.status(201).json({ results: "pouet" })
        // console.log(envoiPost);
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
            "SELECT post.id, post.titre, post.contenu, post.imageUrl, post.timestamp, post.userId, user.pseudo FROM post JOIN user on post.userId=user.id order by post.timestamp DESC",
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage des posts");
                    res.json({ error });
                } else {
                    // console.log(results);
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
        // console.log(id)
        const unPost = await mysqlConnection.query(
            "SELECT post.id, post.titre, post.contenu, post.imageUrl, post.timestamp, post.userId, user.pseudo FROM post JOIN user on post.userId=user.id where post.id = ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage du post");
                    res.json({ error });
                } else {
                    // console.log("getOnePost")
                    // console.log(results)
                    // console.log("a")
                    res.status(200).json({ results });
                    // console.log("ab")
                    async (req, res) => {
                        try {
                            const lesComms = await mysqlConnection.query(
                                "SELECT commentaire.id, commentaire.contenu, commentaire.userId, commentaire.postId, commentaire.timestamp, post.id FROM commentaire JOIN post on commentaire.postId=post.id order by post.timestamp DESC",
                                (error, results) => {
                                    if (error) {
                                        console.log("erreur dans la requete d'affichage du post");
                                        res.json({ error });
                                    } else {
                                        console.log("getAllComments")
                                        console.log(results);
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
        console.log("id")
        console.log(id)
        console.log("req.body modifié")
        console.log(req.body)
        console.log("req.body.titre modifié")
        console.log(req.body.titre)
        const modifiedTitle = req.body.titre
        console.log("req.body.contenu modifié")
        console.log(req.body.contenu)
        const modifiedContain = req.body.contenu
        // console.log("req.auth")
        // console.log(req.auth)
        const unPost = await mysqlConnection.query(
            "SELECT post.id, post.titre, post.contenu, post.imageUrl, post.timestamp, post.userId, user.admin FROM post JOIN user on post.userId=user.id where post.id = ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage pour update du post");
                    res.json({ error });
                } else {
                    console.log("modif results")
                    console.log(results)
                    console.log("req.auth admin")
                    console.log(req.auth.admin)
                    if (req.auth.userId == results[0].userId || req.auth.admin != null) {
                        console.log('utilisateur autorisé');
                        // 3- ya t'il un fichier joint?
                        if (req.file) {
                            // 4- identifier le fichier à supprimer
                            const fileName = results[0].imageUrl.split("/medias")[1];
                            // 5- supprimer le fichier remplacé
                            fs.unlink(`medias/${fileName}`, (error) => {
                                if (error) {
                                    console.log(error);
                                }
                            })
                        }
                        // 4- on met a jour notre post (avec et sans MAJ image)
                        // const infoPost = JSON.parse(req.body.post);
                        // console.log(infoPost);
                        const postObject = req.file ? {
                            // ...JSON.parse(req.body.post),
                            imageUrl: `${req.protocol}://${req.get('host')}/medias/${req.file.filename}`
                        } : { ...req.body }
                        console.log("postObject modif")
                        console.log(postObject)
                        // 7- on met a jour la BDD
                        // const { titre, contenu, imageUrl } = postObject;
                        const reSendToDatabase = req.file ?
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
                        console.log("reSendToDatabase")
                        console.log(reSendToDatabase)
                        const newValues = req.file ?
                            [modifiedTitle, modifiedContain, postObject.imageUrl, id]
                            :
                            [modifiedTitle, modifiedContain, id]
                            ;
                        console.log("newValues")
                        console.log(newValues)
                        mysqlConnection.query(reSendToDatabase, newValues)
                        // , (error, results) => {
                        //     if (error) {
                        //         console.log("souci d'envoi de la maj")
                        //         res.status(500).json({ error });
                        //     } else {
                        //         console.log("maj effectuée")
                        //         // console.log(results)
                        res.status(201).end() // .json({ results: "youpi" });
                        // console.log('pouet')
                        //     }
                        // })
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
            "SELECT post.id, post.titre, post.contenu, post.imageUrl, post.timestamp, post.userId, user.admin FROM post JOIN user on post.userId=user.id where post.id = ? ", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage pour suppression du post");
                    res.json({ error });
                } else {
                    // res.status(200).json({ results });
                    if (results != 0) {
                        console.log("post existant")
                    } else {
                        console.log('post inexistant');
                        return res.status(404).json({ error })
                    }
                    console.log("req.auth.userId suppression")
                    console.log(req.auth.userId)
                    console.log("req.auth suppression")
                    console.log(req.auth)
                    console.log("results[0]")
                    console.log(results[0])
                    console.log("results[0].userId")
                    console.log(results[0].userId)
                    console.log("req.auth admin")
                    console.log(req.auth.admin)
                    // 2- a t'on le droit de modifier ce post ?
                    if (req.auth.userId == results[0].userId || req.auth.admin != null) {
                        console.log('utilisateur autorisé à supprimer');
                        // 4- identifier le fichier à supprimer
                        console.log(results[0].imageUrl);
                        const fileName = results[0].imageUrl.split("/medias")[1];
                        console.log(fileName)
                        // 5- supprimer le fichier remplacé
                        fs.unlink(`medias/${fileName}`, (error) => {
                            if (error) {
                                console.log("erreur lors de la suppression de fichier")
                                console.log(error);
                            }
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

//////////////////////////////////
// la creation d'un commentaire //
//////////////////////////////////

exports.createComment = async (req, res) => {
    // console.log("req")
    // console.log(req)
    console.log("req.body")
    console.log(req.body)
    const contenu = req.body.contenu
    const postId = req.body.postId
    // console.log("req.body.postId")
    // console.log(req.body.postId)
    // console.log("req.body.contenu")
    // console.log(req.body.contenu)
    // console.log("req.auth")
    // console.log(req.auth)
    // console.log("req.auth.userId")
    // console.log(req.auth.userId)
    // console.log("req.file")
    // console.log(req.file)
    // const commObject = JSON.parse(req.body);
    // const postId = req.body;
    // console.log("postId")
    // console.log(postId)
    const userId = req.auth.userId
    // const { postId, contenu } = commObject;
    // console.log('3')
    console.log("userId")
    console.log(userId)
    // console.log("titre")
    // console.log(titre)
    // console.log("contenu")
    // console.log(contenu)

    const commentaire = new Commentaire(postId, userId, contenu);
    // console.log('4 bis')
    console.log(commentaire)
    const values = [postId, userId, contenu];
    try {
        const envoiPost = await mysqlConnection.query(
            `INSERT INTO commentaire(postId, userId, contenu)
                VALUES (?)`, [values],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete de creation des commentaires");
                    res.json({ error });
                } else {
                    console.log("c'est parti")
                    // console.log(results)
                    res.status(201).json({ results });
                }
            }
        );
    }
    catch (err) {
        console.log('souci avec createComment')
        res.status(500).json({ error: err });
    }
}

//////////////////////////////////
// l'affichage des commentaires //
//////////////////////////////////

exports.getAllComments = async (req, res) => {
    try {
        const id = JSON.parse(req.params.id);
        console.log(id)

        const lesComms = await mysqlConnection.query(
            "SELECT commentaire.contenu, commentaire.postId, commentaire.timestamp, post.id, user.pseudo FROM commentaire JOIN post on commentaire.postId=post.id JOIN user on commentaire.userId=user.id where post.id = ? order by commentaire.timestamp DESC", [id],
            (error, results) => {
                if (error) {
                    console.log("erreur dans la requete d'affichage des commentaires");
                    console.log((error));
                    res.json({ error });
                } else {
                    console.log("getAllComments")
                    console.log(results);
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