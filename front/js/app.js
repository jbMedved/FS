const passwordErrorMsg = document.getElementById('passwordErrorMsg');
const emailErrorMsg = document.getElementById('emailErrorMsg');

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

function initiales(pseudo) {
    let a = pseudo.split(' '),
        l = a.length,
        i = 0,
        n = "";
    for (; i < l; ++i) {
        n += a[i].charAt(0);
    }
    console.log(n);
}

new Vue({
    el: 'allThePage',
    data: {
        menuOn: false,
        loginOn: true,
        signupOn: true,
        isConnected: true,
        isNotConnected: true,
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
        isMine: true,
    },
    methods: {
        changeMenuOn: function () {
            this.menuOn = !this.menuOn
        },
        changeLoginOn: function () {
            this.loginOn = !this.loginOn
        },
        changeSignupOn: function () {
            this.signupOn = !this.signupOn
        },
        // pour la connexion
        loginValidation: function () {
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
                    if (res.ok) {
                        console.log("utilisateur connecté");
                        console.log(res);
                        return res.json();
                    } else {
                        console.log('utilisateur ou mot de passe incorrect')
                    }
                })
                .catch(function (err) {
                    console.error(err)
                    alert("souci avec le serveur : réessayez ultérieurement")
                });

        },
        // pour l'insciption
        signupValidation: function () {
            // le mot de passe et la confirmation correspondent?
            if (this.signup_password != this.signup_password2) {
                // console.log(signup_password);
                // console.log(signup_password2)
                alert("mots de passe différents")
            } else {
                // on récupere l'email, le mot de passe, le nom et le prénom
                // console.log("ok go pour l'envoi");
                let signupToSend = {
                    "email": this.signup_email,
                    "password": this.signup_password,
                    "LastName": this.signup_lastName,
                    "FirstName": this.signup_firstName
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
                        alert("souci avec l'envoi : réessayez ultérieurement")
                    });
            }
        },
    }
})
