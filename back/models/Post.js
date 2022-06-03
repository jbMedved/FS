// ici on va mettre notre schema pour la table post
class Post {
    // on crée le modele User
    constructor(titre, contenu, userId, imageUrl) {
        this.titre = titre;
        this.contenu = contenu;
        this.userId = userId;
        this.imageUrl = imageUrl;
    }
}

// on exporte notre classe Post
module.exports = Post;

