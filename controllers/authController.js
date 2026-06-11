const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

const authController = {
    renderLogin: (req, res) => {
        res.render('users/login');
    },

    login: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findByUsername(username, (err, user) => {
            if (err) return res.status(500).json({ error: err });
            if (!user) return res.status(401).json({ message: 'Usuário ou senha inválidos' });

            bcrypt.compare(password, user.password, (err2, same) => {
                if (err2) return res.status(500).json({ error: err2 });
                if (!same) return res.status(401).json({ message: 'Usuário ou senha inválidos' });

                const payload = { id: user.id, username: user.username, role: user.role };
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

                // Retornar token em JSON. O frontend/admin pode armazenar em localStorage ou cookie.
                res.json({ token, user: payload });
            });
        });
    }
};

module.exports = authController;
