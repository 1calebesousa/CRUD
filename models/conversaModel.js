const db = require('../config/db');

const Conversa = {
    create: (conversa, callback) => {
        const query = 'INSERT INTO conversas (veiculo_id, visitor_identifier, user_id, admin_id, status) VALUES (?, ?, ?, ?, ?)';
        const params = [conversa.veiculo_id, conversa.visitor_identifier || null, conversa.user_id || null, conversa.admin_id || null, conversa.status || 'aberta'];
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT * FROM conversas WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    findByVeiculoAndVisitor: (veiculoId, visitorIdentifier, callback) => {
        const query = 'SELECT * FROM conversas WHERE veiculo_id = ? AND visitor_identifier = ? LIMIT 1';
        db.query(query, [veiculoId, visitorIdentifier], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    updateStatus: (id, status, callback) => {
        const query = 'UPDATE conversas SET status = ? WHERE id = ?';
        db.query(query, [status, id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getAll: (filters, callback) => {
        let query = 'SELECT * FROM conversas WHERE 1=1';
        const params = [];
        if (filters.veiculo_id) {
            query += ' AND veiculo_id = ?';
            params.push(filters.veiculo_id);
        }
        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        query += ' ORDER BY updated_at DESC';
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Conversa;
