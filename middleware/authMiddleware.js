const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
}

function isAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Não autenticado' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acesso negado' });
    next();
}

module.exports = { authenticateJWT, isAdmin };
