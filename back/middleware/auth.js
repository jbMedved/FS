// on importe notre utilitaire pour la gestion des tokens : JSONWEBTOKEN
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // console.log('req')
        // console.log(req)
        // console.log("req.headers.authorization");
        // console.log(req.headers.authorization);
        // console.log('req.headers["authorization"]');
        // console.log(req.headers["authorization"]);
        const token = req.headers.authorization.split(' ')[1];
        // console.log("token");
        // console.log(token);
        const decodedToken = jwt.verify(token, 'SECUREKEY');
        // console.log("decodedToken");
        // console.log(decodedToken);
        const userId = decodedToken.userId;
        // console.log("userId");
        // console.log(userId);

        // console.log('decodedToken.userId');
        // console.log(decodedToken.userId);
        // console.log(req)
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'ID utilisateur non valable';
        } else {
            console.log('token décodé')
            next();
        }
    } catch (error) {
        console.log('souci comparaison des tokens')
        console.log(error)
        res.status(401).json({ error: error | 'requête non authentifiée' });
    }
};