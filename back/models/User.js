// ici on va mettre notre schema pour la table user
const userSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // id	INTEGER	auto_increment	primary key
    email: { type: String, required: true },            // email	varchar (100)	NOT NULL	unique
    password: { type: String, required: true },         // password	varchar(100)	NOT NULL
    pseudo: { type: String, required: true },	        // pseudo	varchar(100)	NOT NULL
    admin: { type: Boolean }		                    // admin	boolean		
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
