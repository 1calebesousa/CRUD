const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        if (req.accepts('html') && !req.xhr) {
            return res.redirect('/auth/login');
        }
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (req.accepts('html') && !req.xhr) {
                return res.redirect('/auth/login');
            }
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        res.locals.user = decoded;
        next();
    });
}

function setUserIfAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (!err && decoded) {
                req.user = decoded;
                res.locals.user = decoded;
            }
            next();
        });
    } else {
        next();
    }
}

function isAdmin(req, res, next) {
    if (!req.user) {
        if (req.accepts('html') && !req.xhr) return res.redirect('/auth/login');
        return res.status(401).json({ message: 'Não autenticado' });
    }
    if (req.user.role !== 'admin') {
        if (req.accepts('html') && !req.xhr) return res.status(403).send('Acesso negado: Requer privilégios de Administrador.');
        return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
}

module.exports = { authenticateJWT, setUserIfAuthenticated, isAdmin };
