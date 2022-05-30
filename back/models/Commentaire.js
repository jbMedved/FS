// ici on va mettre notre schema pour la table commentaire
class Commentaire {
    // on crée le modele User
    constructor(postId, userId, contenu) {
        this.post_id = postId;
        this.user_id = userId;
        this.contenu = contenu;
    }
}

// on exporte notre classe Post
module.exports = Commentaire;

