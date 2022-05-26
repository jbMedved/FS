// ici on va mettre notre schema pour la table post
const postSchema = mongoose.Schema({
    // id	INTEGER	auto_increment	primary key
    user_id: { type: Number, required: true },  // user_id	INTEGER	NOT NULL
    titre: { type: String, required: true },    // titre	varchar (100)	NOT NULL
    contenu: { type: String, required: true },  // contenu	varchar (1000)	NOT NULL
    image_url: { type: String }                 // image_url	varchar(100)

})






module.exports = mongoose.model('Post', postSchema);
