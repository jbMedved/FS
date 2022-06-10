const passwordErrorMsg = document.getElementById("passwordErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");
// const emailErrorMsg = document.querySelector("#emailErrorMsg")
const buttons = document.getElementById(".posts");
const postsContenu = document.getElementById("posts_contenu");
const creationForm = document.getElementById("creationForm");
const postMenu = document.getElementById("posts");

const signupmailText = ""
const signuppwdText = ""
const signuplastnameText = ""
const signupfirstnameText = ""
const signuppwd2Text = ""

//on veut  que l'adresse mail saisie soit l'adresse mail pro
regexMail = /^[^@\s]+@[groupomania]+\.[fr]+$/g;
regexPassword = /^(?=.{8,}$)(?=(?:.*?[A-Z]))(?=.*?[a-z])(?=(?:.*?[0-9])).*$/g;

// if (mail.match(regexMail) == null) {
//     emailErrorMsg.innerHTML = 'veuillez saisir votre email professionnel svp'
// } else if (motDePasse.match(regexPassword) == null) {
//     passwordErrorMsg.innerHTML = `le mot de passe doit avoir au moins:
//          - 1 Majuscule
//          - 1 Minuscule
//          - 1 chiffre
//          - 8 caracteres`
// } else { }




// } else if (firstNameText.match(regexName) == null) {
//     firstNameErrorMsg.innerHTML = "Champ non rempli / non valide"
// } else if (lastNameText.match(regexName) == null) {
//     lastNameErrorMsg.innerHTML = "Champ non rempli / non valide"
// } else if (addressText.match(regexOther) == null) {
//     addressErrorMsg.innerHTML = "Champ non rempli / non valide"
// } else if (cityText.match(regexName) == null) {
//     cityErrorMsg.innerHTML = "Champ non rempli / non valide"
// } else if (emailText.match(regexMail) == null) {
//     emailErrorMsg.innerHTML = "Champ non rempli / non valide"





new Vue({
    el: 'allThePage',
    data: {
        menuOn: true,
        loginOn: true,
        signupOn: true,
        isConnected: false,
        seeProfile: false,
        login_email: "",
        login_password: "",
        signup_email: "",
        signup_password: "",
        signup_lastName: "",
        signup_firstName: "",
        signup_password2: "",
        emailErrorMsgContain: "",
        passwordErrorMsgContain: "",
        passwordErrorMsgContain2: "",
        postTitle: "",
        postUrl: "",
        postText: "",
        isMine: "",
        createMode: false,
        nom: "",
        prenom: "",
        creationTitle: "",
        creationfile: "",
        creationText: "",
        posts: "",
        whoAmI: "",
        seeAllPosts: false,
        isSelected: false,
        selectedTitle: "",
        selectedImageUrl: "",
        selectedContain: "",
        selectedUser: "",
        selectedId: "",
        addComment: false,
        commentText: "",
        idSelectedFound: "",
        comments: "",
        goToModify: false,
        modifiedTitle: "",
        modifiedContain: "",
        allComments: "",
    },
    methods: {
        // ici c'est pour afficher ou non le contenu des diiferentes parties

        changeMenuOn: function () {
            this.menuOn = !this.menuOn
        },
        changeLoginOn: function () {
            this.loginOn = !this.loginOn
        },
        changeSignupOn: function () {
            this.signupOn = !this.signupOn
        },
        create: function () {
            this.createMode = !this.createMode
        },

        /////////////////
        // les boutons //
        /////////////////

        // le bouton "profil"
        userProfile: function () {
            this.seeProfile = !this.seeProfile
            this.createMode = false;
            // console.log(this.seeProfile)
            let pseudo = localStorage.getItem("pseudo");
            // console.log(pseudo)
            pseudo = JSON.parse(pseudo)
            // console.log(pseudo)
            this.nom = pseudo.split(" ")[1]
            // console.log(this.nom);
            this.prenom = pseudo.split(" ")[0]
            // console.log(this.prenom);
        },
        // le bouton "déconnexion"
        disconnectUser: function () {
            console.log('on débranche tout!')
            token = []
            pseudo = []
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("pseudo", JSON.stringify(pseudo));
            localStorage.removeItem("token");
            localStorage.removeItem("pseudo");
            this.isConnected = false;
            this.menuOn = false;
            this.createMode = false;
            this.loginOn = false;
            this.signupOn = false;
            this.whoAmI = "";
            this.seeProfile = false;
        },

        ///////////////////////
        // pour la connexion //
        ///////////////////////
        loginValidation: function (e) {
            e.preventDefault();
            // on récupere l'email et le mot de passe
            let loginToSend = {
                "email": this.login_email,
                "password": this.login_password,
            };

            //et on envoie le tout
            fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(loginToSend)
            })
                .then(function (res) {
                    // console.log("res")
                    // console.log(res)
                    if (res.ok) {
                        console.log("utilisateur connecté");
                        return res.json();

                    } else {
                        console.log('email ou mot de passe incorrect')
                    }
                })
                //on ajoute notre token dans localstorage
                .then((data) => {
                    const $token = data.token;
                    this.whoAmI = data.userId
                    // console.log(data)
                    const pseudo = data.pseudo;
                    if ($token != undefined && pseudo != undefined) {
                        // localStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("token", $token);
                        localStorage.setItem("pseudo", JSON.stringify(pseudo));
                        // maintenant que l'on est connecté et que notre token est dans localstorage
                        // on va afficher l'ensemble des posts
                        this.isConnected = true;
                        this.seeAllPosts = true
                    }
                })
                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec le serveur : connexion momentanément impossible")
                    alert("email ou mot de passe incorrect")
                });

        },

        ///////////////////////
        // pour l'insciption //
        ///////////////////////
        signupValidation: function (e) {
            e.preventDefault()

            // les champs sont ils bien tous remplis ?
            if (!this.signup_email || !this.signup_password || !this.signup_lastName || !this.signup_firstName || !this.signup_password2) {
                alert("au moins un des champs n'est pas rempli")
                //a t'on saisi l'adresse mail pro?
            } else if (this.signup_email.match(regexMail) == null) {
                console.log('veuillez saisir votre email professionnel svp')
                this.emailErrorMsgContain = 'veuillez saisir votre email professionnel svp'
                // le mot de passe respecte t'il les standards minimums de sécurité?
            } else if (this.signup_password.match(regexPassword) == null) {
                console.log("pwd pb")
                this.passwordErrorMsgContain = `le mot de passe doit avoir au moins:
                     - 1 Majuscule
                     - 1 Minuscule
                     - 1 chiffre
                     - 8 caracteres`
                console.log("erreur 2")
                // le mot de passe et sa confirmation concordent t'ils?
            } else if (this.signup_password != this.signup_password2) {
                console.log("mots de passe différents")
                this.passwordErrorMsgContain = "mots de passe différents"
                this.passwordErrorMsgContain2 = "mots de passe différents"
                // si tout est OK, on envoie
            } else {
                let sendEmail = this.signup_email;
                let sensPassword = this.signup_password;
                let sendLastName = this.signup_lastName;
                let sendFirstName = this.signup_firstName;
                // on récupere l'email, le mot de passe, le nom et le prénom
                // console.log("ok go pour l'envoi");
                let signupToSend = {
                    "email": sendEmail,
                    "password": sensPassword,
                    "LastName": sendLastName,
                    "FirstName": sendFirstName
                };

                fetch("http://localhost:3000/api/auth/signup", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(signupToSend)
                })
                    .then(function (res) {
                        if (res.ok) {
                            console.log("compte créé")
                            alert('compte créé')
                            this.isConnected = false;
                            return res.json();
                        }
                    })
                    .catch(function (err) {
                        console.error(err)
                        this.isConnected = false;
                        alert("souci avec la création de compte : réessayez ultérieurement")
                    });
            }
        },


        /////////////////////////
        // la creation de post //
        /////////////////////////
        creationValidation: function (e) {
            e.preventDefault();
            this.seeProfile = false
            //on recupère l'id du créateur du post (celui qui est connecté)
            let token = localStorage.getItem("token");

            fetch("http://localhost:3000/api/auth/me", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        console.log("id récupéré pour creation de post")
                        return res.json();
                    }
                })
                .then((id) => {
                    console.log("id")
                    console.log(id)
                })

                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec l'envoi recupId : réessayez ultérieurement")
                    console.log("souci avec l'envoi recupId : réessayez ultérieurement")
                    this.disconnectUser
                });
            // on récupere le titre, l'image s'il y en a une et le contenu du texte
            // en y incorporant le userId
            let formDataCreation = new FormData();

            console.log("creationfile.files[0]")
            console.log(creationfile.files[0])
            console.log("formDataCreation avant append")
            console.log(formDataCreation)
            formDataCreation.append("creationfile", creationfile.files[0])
            formDataCreation.append("contenu", this.creationText)
            formDataCreation.append("titre", this.creationTitle)
            console.log("formDataCreation apres append")
            console.log(formDataCreation)

            // et on envoie le tout
            fetch("http://localhost:3000/api/post", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataCreation
            })
                .then(function (res) {
                    console.log("post envoyé 1")
                    if (res.ok) {
                        console.log("post envoyé")
                        return res.json();
                    }
                })
                .then(function (data) {
                    console.log(data)
                })
                .catch(function (err) {
                    console.error(err)
                    alert(err)
                });
        },

        ///////////////////////////
        // l'affichage des posts //
        ///////////////////////////
        seePosts: function () {
            this.seeAllPosts = !this.seeAllPosts
            this.createMode = false
            this.seeProfile = false
            this.menuOn = false
            // console.log('seePosts')
            //on recupère l'id du comte connecté 
            let token = localStorage.getItem("token");
            fetch("http://localhost:3000/api/auth/me", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        // console.log("id récupéré pour affichage post")
                        return res.json();
                    }
                })
                .then((id) => {
                    this.whoAmI = id.idFound;
                })

                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec l'envoi recupId : réessayez ultérieurement")
                    console.log("souci avec l'envoi recupId : réessayez ultérieurement")
                    this.disconnectUser
                });

            fetch("http://localhost:3000/api/post", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    } else {
                        console.log('utilisateur ou mot de passe incorrect')
                        this.disconnectUser
                    }
                })
                .then((data) => {
                    this.posts = data.results
                    // console.log("this.posts")
                    // console.log(this.posts)
                })
                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec le serveur : connexion momentanément impossible")
                    console.log("souci avec le serveur : connexion momentanément impossible")
                    this.disconnectUser
                });
        },


        ///////////////////////////
        // l'affichage d'un post //
        ///////////////////////////
        coucou: function (idPost) {
            // console.log(idPost)
            this.isSelected = true;
            // on recupère l'id de l'utilisateur connecté
            let token = localStorage.getItem("token");
            // console.log(`http://localhost:3000/api/post/${idPost}`)
            selectedUrl = `http://localhost:3000/api/post/${idPost}`
            // on envoie la requete GET
            fetch(selectedUrl, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        return res.json();
                    } else {
                        console.log('utilisateur ou mot de passe incorrect')
                    }
                })
                .then((data) => {
                    // console.log('resultats du getOne')
                    // console.log(data)
                    const whatISee = data.results[0]
                    this.seeAllPosts = false
                    this.selectedTitle = whatISee.titre
                    this.selectedId = whatISee.id
                    this.selectedImageUrl = whatISee.imageUrl
                    this.selectedContain = whatISee.contenu
                    this.selectedUser = whatISee.pseudo


                    // console.log('whoAmI')
                    // console.log(this.whoAmI)
                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec le serveur : connexion momentanément impossible")
                });

            // on recupere les commentaires
            selectedUrl2 = `http://localhost:3000/api/post/${idPost}/comments`
            // on envoie la requete GET
            fetch(selectedUrl2, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        // console.log(res)
                        return res.json();
                    } else {
                        console.log('utilisateur ou mot de passe incorrect')
                    }
                })
                .then((data) => {
                    // console.log('resultats du getOne')
                    // console.log(data)
                    this.allComments = data.results
                    // console.log(data.results[0])
                    // console.log("data.results")
                    // console.log(data.results)
                    // console.log('whoAmI')
                    // console.log(this.whoAmI)
                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec le serveur : connexion momentanément impossible")
                });
        },

        ///////////////////////
        // ajout commentaire //
        ///////////////////////
        commenter: function () {
            console.log("youpi")
            this.addComment = !this.addComment
        },

        createComment: function (e) {
            e.preventDefault();
            //on recupère l'id du créateur du post (celui qui est connecté)
            let token = localStorage.getItem("token");

            fetch("http://localhost:3000/api/auth/me", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        console.log("id récupéré pour commentaire")
                        return res.json();
                    }
                })
                .then((id) => {
                    // console.log("id")
                    console.log(id)
                })

                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec l'envoi recupId : réessayez ultérieurement")
                    console.log("souci avec l'envoi recupId : réessayez ultérieurement")
                    this.disconnectUser
                });
            // on récupere le titre, l'image s'il y en a une et le contenu du texte
            // en y incorporant le userId
            let formDataCommentCreation = new FormData();
            console.log("this.selectedId");
            console.log(this.selectedId);
            console.log("this.commentText")
            console.log(this.commentText)

            formDataCommentCreation.append("postId", this.selectedId)
            formDataCommentCreation.append("contenu", this.commentText)
            const datasent = {
                "postId": this.selectedId,
                "contenu": this.commentText
            }

            const sendToUrl = `http://localhost:3000/api/post/${this.selectedId}`
            console.log("sendToUrl")
            console.log(sendToUrl)

            // et on envoie le tout
            fetch(sendToUrl, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(datasent)
                // formDataCommentCreation
            })
                .then(function (res) {
                    if (res.ok) {
                        console.log("commentaire envoyé")
                        return res.json();
                    }
                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec l'envoi : réessayez ultérieurement")
                });
        },

        //////////////////////////
        // modification de post //
        //////////////////////////
        modifier: function () {
            console.log("modifions")
            this.goToModify = !this.goToModify
        },
        modificationValidation: function (e) {
            // e.preventDefault
            this.isSelected = true;

            // on récupere le titre, l'image s'il y en a une et le contenu du texte
            let formDataModification = new FormData();
            formDataModification.append("creationfile", modificationfile.files[0])
            formDataModification.append("contenu", this.modifiedContain)
            formDataModification.append("titre", this.modifiedTitle)

            // et on envoie le tout
            let token = localStorage.getItem("token");
            // console.log(`http://localhost:3000/api/post/${this.selectedId} in modify`)
            selectedUrl = `http://localhost:3000/api/post/${this.selectedId}`

            fetch(selectedUrl, {
                method: "PUT",
                headers: {
                    // 'Accept': 'application/json',
                    // 'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: formDataModification

            })
                .then(function (res) {
                    if (res.ok) {
                        // console.log(res)
                        console.log("post modifié")
                        // this.coucou()
                        // return res.json();
                    }
                })
                // .then(function (data) {
                //     console.log(data)
                // })
                .catch(function (err) {
                    console.error(err)
                    alert(err)
                    // alert("souci avec la modification : réessayez ultérieurement")
                });
        },

        /////////////////////////
        // suppression de post //
        /////////////////////////
        supprimer: function () {

            console.log("supprimons")

            //on recupère l'id de celui qui veut supprimer le post
            let token = localStorage.getItem("token");
            fetch("http://localhost:3000/api/auth/me", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        console.log("id récupéré pour affichage post")
                        return res.json();
                    }
                })
                .then((id) => {
                    this.whoAmI = id.idFound;
                })
                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec l'envoi recupId : réessayez ultérieurement")
                    console.log("souci avec l'envoi recupId : réessayez ultérieurement")
                    this.disconnectUser
                });
            selectedUrl = `http://localhost:3000/api/post/${this.selectedId}`
            fetch(selectedUrl, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(() => {
                    this.goToModify = false;
                    this.seeAllPosts = true
                })
                .catch(() => {
                    console.log('souci')
                })
        },
    },
    mounted: function () {
        // a t'on deja un token? et est il valable?
        let token = localStorage.getItem("token");
        // console.log(token)
        // si le token est vide
        if (token == null) {
            console.log("personne de connecté")
            this.isConnected = false;
            this.menuOn = false;
            this.createMode = false;
            this.loginOn = false;
            this.signupOn = false;
            this.whoAmI = "";
            this.seeProfile = false;
            // si le token n'est pas vide
        } else {
            fetch("http://localhost:3000/api/auth/me", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
                .then(function (res) {
                    if (res.ok) {
                        // console.log(res)
                        this.isConnected = true
                        return res.json();
                    }
                })
                .then((id) => {
                    // console.log("id user trouvé")
                    // console.log(id)
                    if (id == null || id == undefined || id == []) {
                        token = []
                        pseudo = []
                        localStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("pseudo", JSON.stringify(pseudo));
                        localStorage.removeItem("token");
                        localStorage.removeItem("pseudo");
                        this.isConnected = false;
                        this.menuOn = false;
                        this.createMode = false;
                        this.loginOn = false;
                        this.signupOn = false;
                        this.whoAmI = "";
                        this.seeProfile = false;
                    } else {
                        this.isConnected = true
                    }
                })

                .catch(function (err) {
                    console.error(err)
                    // alert("souci avec l'envoi recupId : réessayez ultérieurement")
                    console.log("souci avec l'envoi recupId : réessayez ultérieurement")
                    token = []
                    pseudo = []
                    localStorage.setItem("token", JSON.stringify(token));
                    localStorage.setItem("pseudo", JSON.stringify(pseudo));
                    localStorage.removeItem("token");
                    localStorage.removeItem("pseudo");
                    this.isConnected = false;
                    this.menuOn = false;
                    this.createMode = false;
                    this.loginOn = false;
                    this.signupOn = false;
                    this.whoAmI = "";
                    this.seeProfile = false;
                })
        }
    }
})
