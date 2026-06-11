const db = require('../config/db');

const Veiculo = {
    create: (veiculo, callback) => {
        const query = `INSERT INTO veiculos (marca, modelo, versao, ano, ano_modelo, cor, combustivel, cambio, motorizacao, quilometragem, placa, renavam, preco, descricao, observacoes, portas, tipo_veiculo, situacao, video_url)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            veiculo.marca,
            veiculo.modelo,
            veiculo.versao || null,
            veiculo.ano || null,
            veiculo.ano_modelo || null,
            veiculo.cor || null,
            veiculo.combustivel || null,
            veiculo.cambio || null,
            veiculo.motorizacao || null,
            veiculo.quilometragem || null,
            veiculo.placa || null,
            veiculo.renavam || null,
            veiculo.preco || 0.0,
            veiculo.descricao || null,
            veiculo.observacoes || null,
            veiculo.portas || null,
            veiculo.tipo_veiculo || null,
            veiculo.situacao || 'disponivel',
            veiculo.video_url || null
        ];

        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results.insertId);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT * FROM veiculos WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    update: (id, veiculo, callback) => {
        const query = `UPDATE veiculos SET marca = ?, modelo = ?, versao = ?, ano = ?, ano_modelo = ?, cor = ?, combustivel = ?, cambio = ?, motorizacao = ?, quilometragem = ?, placa = ?, renavam = ?, preco = ?, descricao = ?, observacoes = ?, portas = ?, tipo_veiculo = ?, situacao = ?, video_url = ? WHERE id = ?`;
        const params = [
            veiculo.marca,
            veiculo.modelo,
            veiculo.versao || null,
            veiculo.ano || null,
            veiculo.ano_modelo || null,
            veiculo.cor || null,
            veiculo.combustivel || null,
            veiculo.cambio || null,
            veiculo.motorizacao || null,
            veiculo.quilometragem || null,
            veiculo.placa || null,
            veiculo.renavam || null,
            veiculo.preco || 0.0,
            veiculo.descricao || null,
            veiculo.observacoes || null,
            veiculo.portas || null,
            veiculo.tipo_veiculo || null,
            veiculo.situacao || 'disponivel',
            veiculo.video_url || null,
            id
        ];

        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    delete: (id, callback) => {
        const query = 'DELETE FROM veiculos WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // getAll com filtros simples e paginação
    getAll: (filters, callback) => {
        let query = 'SELECT * FROM veiculos WHERE 1=1';
        const params = [];

        if (filters.marca) {
            query += ' AND marca = ?';
            params.push(filters.marca);
        }
        if (filters.ano) {
            query += ' AND ano = ?';
            params.push(filters.ano);
        }
        if (filters.situacao) {
            query += ' AND situacao = ?';
            params.push(filters.situacao);
        }

        // ordenação
        if (filters.orderBy) {
            const allowed = ['preco','created_at','ano'];
            if (allowed.includes(filters.orderBy)) {
                query += ` ORDER BY ${filters.orderBy} ${filters.orderDir === 'DESC' ? 'DESC' : 'ASC'}`;
            }
        } else {
            query += ' ORDER BY created_at DESC';
        }

        // paginação
        const page = parseInt(filters.page, 10) || 1;
        const pageSize = parseInt(filters.pageSize, 10) || 20;
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        db.query(query, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Veiculo;
