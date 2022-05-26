// ici on va mettre notre schema pour la table user
class User {
    // on crée le modele User
    constructor(email, password, lastName, FirstName) {
        this.email = email;
        this.password = password;
        this.pseudo = FirstName + " " + lastName;
    }
    //on utilise l'utilitaire de cryptage du mot de passe : BCRYPT

}

// on exporte notre classe User
module.exports = User;
