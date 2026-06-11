const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userController = {
    createUser: (req, res) => {
        const rawPassword = req.body.password || '';
        bcrypt.hash(rawPassword, SALT_ROUNDS, (err, hashed) => {
            if (err) return res.status(500).json({ error: 'Erro ao hashear senha' });

            const newUser = {
                username: req.body.username,
                password: hashed,
                role: req.body.role,
            };

            User.create(newUser, (err2, userId) => {
                if (err2) {
                    return res.status(500).json({ error: err2 });
                }
                res.redirect('/users');
            });
        });
    },

    getUserById: (req, res) => {
        const userId = req.params.id;

        User.findById(userId, (err, user) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.render('users/show', { user });
        });
    },

    getAllUsers: (req, res) => {
        User.getAll((err, users) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.render('users/index', { users });
        });
    },

    renderCreateForm: (req, res) => {
        res.render('users/create');
    },

    renderEditForm: (req, res) => {
        const userId = req.params.id;

        User.findById(userId, (err, user) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.render('users/edit', { user });
        });
    },

    updateUser: (req, res) => {
        const userId = req.params.id;
        const rawPassword = req.body.password || null;

        function finishUpdate(passwordToSave) {
            const updatedUser = {
                username: req.body.username,
                password: passwordToSave,
                role: req.body.role,
            };

            User.update(userId, updatedUser, (err) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.redirect('/users');
            });
        }

        if (rawPassword) {
            bcrypt.hash(rawPassword, SALT_ROUNDS, (err, hashed) => {
                if (err) return res.status(500).json({ error: 'Erro ao hashear senha' });
                finishUpdate(hashed);
            });
        } else {
            // preserva password atual se não informado (recuperar do DB)
            User.findById(userId, (err, user) => {
                if (err) return res.status(500).json({ error: err });
                if (!user) return res.status(404).json({ message: 'User not found' });
                finishUpdate(user.password);
            });
        }
    },

    deleteUser: (req, res) => {
        const userId = req.params.id;

        User.delete(userId, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.redirect('/users');
        });
    },

    searchUsers: (req, res) => {
        const search = req.query.search || '';

        User.searchByName(search, (err, users) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.json({ users });
        });
    },
};

module.exports = userController;
