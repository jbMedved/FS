// on importe notre utilisatire pour la gestion des tokens : JSONWEBTOKEN
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'M0nSup3rT0k3n');
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.boby.userId && req.body.userId !== userId) {
            throw 'ID utilisateur non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'requête non authentifiée' });
    }
};