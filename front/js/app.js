const passwordErrorMsg = document.getElementById('passwordErrorMsg');
const emailErrorMsg = document.getElementById('emailErrorMsg');
const buttons = document.getElementById(".posts");
const postsContenu = document.getElementById("posts_contenu");
const creationForm = document.getElementById("creationForm");
const postMenu = document.getElementById("posts");

//on veut  que l'adresse mail saisie soit l'adresse mail pro
regexMail = /^[^@\s]+@[groupomania]+\.[fr]+$/g;

// le mot de passe doit avoir au moins:
//     - 1 Majuscule
//     - 1 Minuscule
//     - 1 chiffre
//     - 8 caracteres
regexPassword = /^(?=.{8,}$)(?=(?:.*?[A-Z]))(?=.*?[a-z])(?=(?:.*?[0-9])).*$/g;
// const mail = req.body.email;
// const motDePasse = req.body.password;
// if (mail.match(regexMail) == null) {
// emailErrorMsg.innerHTML = 'veuillez saisir votre email professionnel svp'
// }else if (motDePasse.match(regexPassword) == null) {
// passwordErrorMsg.innerHTML = `le mot de passe doit avoir au moins:
//      - 1 Majuscule
//      - 1 Minuscule
//      - 1 chiffre
//      - 8 caracteres`
// } else {

// function initiales(pseudo) {
//     let a = pseudo.split(' '),
//         l = a.length,
//         i = 0,
//         n = "";
//     for (; i < l; ++i) {
//         n += a[i].charAt(0);
//     }
//     console.log(n);
// }
// function seePosts() {
//     fetch("http://localhost:3000/api/post", {
//         method: "GET",
//         headers: {
//             'Accept': 'application/json',
//             'Content-type': 'application/json'
//         },
//     })
//         .then(function (res) {
//             if (res.ok) {
//                 // console.log(res)
//                 this.posts = res
//                 return res.json();

//             } else {
//                 console.log('utilisateur ou mot de passe incorrect')
//             }
//         })
//         .then((data) => {
//             console.log(data)
//             // postsContenu.innerHTML = `
//             // <div class="post_example" v-for="post in posts">
//             //     <div class="title_post">
//             //         <h3>titre: {{ this.post.titre }} </h3>
//             //         <h4> par: {{ this.pseudo }} </h4>
//             //     </div>
//             //     <div class="image_post">
//             //         <img src="{{this.post.imageUrl}}" 
//             //         alt="{{ this.post.title }}"/>                                
//             //     </div>
//             //     <div class="text_post">
//             //         {{ this.post.text }}
//             //     </div>
//             //     <div class="buttons">
//             //         <button class="update_post" v-show ="isMine"> modifier </button>
//             //         <button class="comment_post" > commenter </button>
//             //         <button class="delete_post" v-show ="isMine"> supprimer </button>
//             //     </div>
//             // </div>`

//         })
//         .catch(function (err) {
//             console.error(err)
//             alert("souci avec le serveur : connexion momentanément impossible")
//         });

// }
new Vue({
    el: 'allThePage',
    data: {
        menuOn: true,
        loginOn: true,
        signupOn: true,
        isConnected: true,
        seeProfile: false,
        login_email: "",
        login_password: "",
        signup_email: "",
        signup_password: "",
        signup_lastName: "",
        signup_firstName: "",
        signup_password2: "",
        postTitle: "",
        postUrl: "",
        postText: "",
        isMine: "",
        createMode: true,
        nom: "",
        prenom: "",
        creationTitle: "",
        creationfile: "",
        creationText: "",
        posts: "",
        whoAmI: "",
        seeAllPosts: false,
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
            token = []
            pseudo = []
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("pseudo", JSON.stringify(pseudo));
            this.isConnected = false;
            this.menuOn = false;
            this.createMode = false;
            this.loginOn = false;
            this.signupOn = false;
            this.whoAmI = "";
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
            console.log('informations de connexion');
            // console.log(this.login_email)
            // console.log(this.login_password)
            // console.log(loginToSend)
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
                        console.log('utilisateur ou mot de passe incorrect')
                    }
                })
                //on ajoute notre token dans localstorage
                .then((data) => {
                    const token = data.token;
                    this.whoAmI = data.userId
                    console.log(data)
                    const pseudo = data.pseudo;
                    if (token != undefined && pseudo != undefined) {
                        // localStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("token", token);
                        localStorage.setItem("pseudo", JSON.stringify(pseudo));
                        this.isConnected = true;
                    }
                })
                // maintenant que l'on est connecté et que notre token est dans localstorage
                // on va afficher l'ensemble des posts
                // .then
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec le serveur : connexion momentanément impossible")
                });

        },

        ///////////////////////
        // pour l'insciption //
        ///////////////////////
        signupValidation: function () {
            // le mot de passe et la confirmation correspondent?
            if (this.signup_password != this.signup_password2) {
                // console.log(signup_password);
                // console.log(signup_password2)
                alert("mots de passe différents")
            } else {
                let sendEmail = this.signup_email;
                let sensPassword = this.signup_password;
                let sendLastName = this.signup_lastName;
                let sendFirstName = this.signup_firstName;
                if (!sendEmail.value || !sensPassword.value || !sendLastName.value || !sendFirstName.value) {
                    alert("Merci de remplir tous les champs svp")
                }
                // on récupere l'email, le mot de passe, le nom et le prénom
                // console.log("ok go pour l'envoi");
                let signupToSend = {
                    "email": sendEmail,
                    "password": sensPassword,
                    "LastName": sendLastName,
                    "FirstName": sendFirstName
                };
                // console.log(signupToSend);
                // console.log(JSON.stringify(signupToSend));
                // et on envoie le tout
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
                            return res.json();

                        }
                    })
                    .catch(function (err) {
                        console.error(err)
                        alert("souci avec la création de compte : réessayez ultérieurement")
                    });
            }
        },


        /////////////////////////
        // la creation de post //
        /////////////////////////
        creationValidation: function (e) {
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
                        console.log("id récupéré")
                        // whoAmI= l'id que je dois trouver dans le res
                        // console.log("res")
                        // console.log(res)
                        // console.log("res.body")
                        // console.log(res.body)
                        return res.json();
                    }
                })
                .then((id) => {
                    // console.log("id")
                    console.log(id)
                })

                .catch(function (err) {
                    console.error(err)
                    alert("souci avec l'envoi recupId : réessayez ultérieurement")
                });
            // on récupere le titre, l'image s'il y en a une et le contenu du texte
            // en y incorporant le userId
            let formDataCreation = new FormData();

            console.log("creationfile.files[0]")
            console.log(creationfile.files[0])

            formDataCreation.append("creationfile", creationfile.files[0])
            formDataCreation.append("creationText", this.creationText)
            formDataCreation.append("creationTitle", this.creationTitle)

            console.log(formDataCreation)

            let creationToSend = {
                // userId: this.whoAmI,
                titre: this.creationTitle,
                file: creationfile.files[0],
                // imageurl: this.creationfile,
                contenu: this.creationText
            };

            console.log("creationToSend")
            console.log(creationToSend)
            // et on envoie le tout
            fetch("http://localhost:3000/api/post", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(creationToSend)
                // body: JSON.stringify(formDataCreation)
            })
                .then(function (res) {
                    if (res.ok) {
                        console.log("post envoyé")
                        return res.json();
                    }
                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec l'envoi : réessayez ultérieurement")
                });
        },

        ///////////////////////////
        // l'affichage des posts //
        ///////////////////////////

        seePosts: function () {
            this.seeAllPosts = !this.seeAllPosts
            console.log("this.seeAllPosts")
            console.log(this.seeAllPosts)
            console.log('seePosts')
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
                        console.log("id récupéré")
                        return res.json();
                    }
                })
                .then((id) => {
                    // console.log("id")
                    // console.log(id)
                    this.whoAmI = id.idFound;
                    console.log("qui suis-je ?")
                    console.log(this.whoAmI)
                })

                .catch(function (err) {
                    console.error(err)
                    alert("souci avec l'envoi recupId : réessayez ultérieurement")
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
                        // console.log(res)
                        return res.json();

                    } else {
                        console.log('utilisateur ou mot de passe incorrect')
                    }
                })
                .then((data) => {
                    // console.log(data)
                    // console.log(data.results)
                    this.posts = data.results
                    // console.log("this.whoAmI")
                    // console.log(this.whoAmI)
                    console.log("this.posts")
                    console.log(this.posts)

                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec le serveur : connexion momentanément impossible")
                });
        }
    }





})
// posts.addEventListener('load', seePosts());
