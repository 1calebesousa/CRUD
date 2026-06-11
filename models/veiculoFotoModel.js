const db = require('../config/db');

const VeiculoFoto = {
    create: (veiculoId, filePath, ordem, callback) => {
        const query = 'INSERT INTO veiculo_fotos (veiculo_id, file_path, ordem, is_principal) VALUES (?, ?, ?, ?)';
        const params = [veiculoId, filePath, ordem || 0, 0];
        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findByVeiculoId: (veiculoId, callback) => {
        const query = 'SELECT * FROM veiculo_fotos WHERE veiculo_id = ? ORDER BY ordem ASC, id ASC';
        db.query(query, [veiculoId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    setPrincipal: (id, callback) => {
        // desmarca principal anterior
        const find = 'SELECT veiculo_id FROM veiculo_fotos WHERE id = ?';
        db.query(find, [id], (err, results) => {
            if (err) return callback(err);
            if (!results[0]) return callback(new Error('Foto não encontrada'));
            const veiculoId = results[0].veiculo_id;

            const unset = 'UPDATE veiculo_fotos SET is_principal = 0 WHERE veiculo_id = ?';
            db.query(unset, [veiculoId], (err2) => {
                if (err2) return callback(err2);
                const set = 'UPDATE veiculo_fotos SET is_principal = 1 WHERE id = ?';
                db.query(set, [id], (err3, res) => {
                    if (err3) return callback(err3);
                    callback(null, res);
                });
            });
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM veiculo_fotos WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = VeiculoFoto;
