const db = require('../config/db');

const Mensagem = {
    create: (mensagem, callback) => {
        const query = 'INSERT INTO mensagens (conversa_id, sender_type, sender_id, mensagem, lida) VALUES (?, ?, ?, ?, ?)';
        const params = [mensagem.conversa_id, mensagem.sender_type || 'visitante', mensagem.sender_id || null, mensagem.mensagem, mensagem.lida ? 1 : 0];
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    getByConversaId: (conversaId, callback) => {
        const query = 'SELECT * FROM mensagens WHERE conversa_id = ? ORDER BY created_at ASC';
        db.query(query, [conversaId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    markAsRead: (id, callback) => {
        const query = 'UPDATE mensagens SET lida = 1 WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Mensagem;
