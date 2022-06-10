// on importe notre utilitaire pour la gestion des tokens : JSONWEBTOKEN
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // le token est il vide?
        if (token == [] || token == undefined || token == null) {
            throw res.status(401).json({ error: error | 'requête non authentifiée' });
        }
        //s'il n'est pas vide, on le décode
        const decodedToken = jwt.verify(token, 'SECUREKEY');

        const userId = decodedToken.userId;
        const admin = decodedToken.admin;

        req.auth = { userId, admin };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'ID utilisateur non valable';
        } else {
            // console.log('token décodé')
            next();
        }
    } catch (error) {
        // console.log('souci comparaison des tokens')
        // console.log(error)
        res.status(401).json({ error: error | 'requête non authentifiée' });
    }
};