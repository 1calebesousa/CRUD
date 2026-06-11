const db = require('../config/db');

const adminController = {
    dashboard: (req, res) => {
        // Consultas simples para métricas
        const queries = {
            totalVeiculos: 'SELECT COUNT(*) AS total FROM veiculos',
            vendidos: "SELECT COUNT(*) AS total FROM veiculos WHERE situacao = 'vendido'",
            disponiveis: "SELECT COUNT(*) AS total FROM veiculos WHERE situacao = 'disponivel'",
            conversas: 'SELECT COUNT(*) AS total FROM conversas'
        };

        db.query(queries.totalVeiculos, (err, result1) => {
            if (err) return res.status(500).json({ error: err });
            db.query(queries.vendidos, (err2, result2) => {
                if (err2) return res.status(500).json({ error: err2 });
                db.query(queries.disponiveis, (err3, result3) => {
                    if (err3) return res.status(500).json({ error: err3 });
                    db.query(queries.conversas, (err4, result4) => {
                        if (err4) return res.status(500).json({ error: err4 });

                        const metrics = {
                            totalVeiculos: result1[0].total || 0,
                            vendidos: result2[0].total || 0,
                            disponiveis: result3[0].total || 0,
                            conversas: result4[0].total || 0
                        };

                        res.render('admin/dashboard', { metrics, user: req.user });
                    });
                });
            });
        });
    }
};

module.exports = adminController;
