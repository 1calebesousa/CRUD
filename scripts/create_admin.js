const bcrypt = require('bcrypt');
const db = require('../config/db');

// Usage: node scripts/create_admin.js username password
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Uso: node scripts/create_admin.js <username> <password>');
    process.exit(1);
}

const username = args[0];
const password = args[1];
const SALT_ROUNDS = 10;

bcrypt.hash(password, SALT_ROUNDS, (err, hashed) => {
    if (err) {
        console.error('Erro ao hashear senha:', err);
        process.exit(1);
    }

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, hashed, 'admin'], (err2, result) => {
        if (err2) {
            console.error('Erro ao inserir usuário:', err2.message || err2);
            process.exit(1);
        }
        console.log('Usuário administrador criado com id:', result.insertId);
        db.end();
    });
});
