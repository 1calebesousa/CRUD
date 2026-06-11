const Veiculo = require('../models/veiculoModel');
const VeiculoFoto = require('../models/veiculoFotoModel');

const veiculoController = {
    index: (req, res) => {
        const filters = {
            marca: req.query.marca || null,
            ano: req.query.ano || null,
            situacao: req.query.situacao || null,
            page: req.query.page || 1,
            pageSize: req.query.pageSize || 12,
            orderBy: req.query.orderBy || 'created_at',
            orderDir: req.query.orderDir || 'DESC'
        };

        Veiculo.getAll(filters, (err, veiculos) => {
            if (err) return res.status(500).json({ error: err });
            res.render('veiculos/index', { veiculos, filters });
        });
    },

    renderCreate: (req, res) => {
        res.render('veiculos/create');
    },

    create: (req, res) => {
        const v = req.body;
        const novo = {
            marca: v.marca,
            modelo: v.modelo,
            versao: v.versao,
            ano: v.ano,
            ano_modelo: v.ano_modelo,
            cor: v.cor,
            combustivel: v.combustivel,
            cambio: v.cambio,
            motorizacao: v.motorizacao,
            quilometragem: v.quilometragem,
            placa: v.placa,
            renavam: v.renavam,
            preco: v.preco,
            descricao: v.descricao,
            observacoes: v.observacoes,
            portas: v.portas,
            tipo_veiculo: v.tipo_veiculo,
            situacao: v.situacao || 'disponivel',
            video_url: v.video_url || null
        };

        Veiculo.create(novo, (err, veiculoId) => {
            if (err) return res.status(500).json({ error: err });

            // processar imagens
            if (req.files && req.files.length) {
                let ordem = 0;
                const fotos = req.files.map(f => ({ veiculoId, filePath: 'uploads/' + f.filename, ordem: ordem++ }));
                // salvar em sequência
                (function saveNext(i){
                    if (i >= fotos.length) return res.redirect('/veiculos');
                    const f = fotos[i];
                    VeiculoFoto.create(veiculoId, f.filePath, f.ordem, (err2) => {
                        if (err2) return res.status(500).json({ error: err2 });
                        saveNext(i+1);
                    });
                })(0);
            } else {
                res.redirect('/veiculos');
            }
        });
    },

    show: (req, res) => {
        const id = req.params.id;
        Veiculo.findById(id, (err, veiculo) => {
            if (err) return res.status(500).json({ error: err });
            if (!veiculo) return res.status(404).send('Veículo não encontrado');
            VeiculoFoto.findByVeiculoId(id, (err2, fotos) => {
                if (err2) return res.status(500).json({ error: err2 });
                res.render('veiculos/show', { veiculo, fotos });
            });
        });
    },

    renderEdit: (req, res) => {
        const id = req.params.id;
        Veiculo.findById(id, (err, veiculo) => {
            if (err) return res.status(500).json({ error: err });
            if (!veiculo) return res.status(404).send('Veículo não encontrado');
            VeiculoFoto.findByVeiculoId(id, (err2, fotos) => {
                if (err2) return res.status(500).json({ error: err2 });
                res.render('veiculos/edit', { veiculo, fotos });
            });
        });
    },

    update: (req, res) => {
        const id = req.params.id;
        const v = req.body;
        const updated = {
            marca: v.marca,
            modelo: v.modelo,
            versao: v.versao,
            ano: v.ano,
            ano_modelo: v.ano_modelo,
            cor: v.cor,
            combustivel: v.combustivel,
            cambio: v.cambio,
            motorizacao: v.motorizacao,
            quilometragem: v.quilometragem,
            placa: v.placa,
            renavam: v.renavam,
            preco: v.preco,
            descricao: v.descricao,
            observacoes: v.observacoes,
            portas: v.portas,
            tipo_veiculo: v.tipo_veiculo,
            situacao: v.situacao || 'disponivel',
            video_url: v.video_url || null
        };

        Veiculo.update(id, updated, (err) => {
            if (err) return res.status(500).json({ error: err });
            // processar novas imagens, se houver
            if (req.files && req.files.length) {
                let ordem = 0;
                const fotos = req.files.map(f => ({ veiculoId: id, filePath: 'uploads/' + f.filename, ordem: ordem++ }));
                (function saveNext(i){
                    if (i >= fotos.length) return res.redirect('/veiculos/' + id);
                    const f = fotos[i];
                    VeiculoFoto.create(id, f.filePath, f.ordem, (err2) => {
                        if (err2) return res.status(500).json({ error: err2 });
                        saveNext(i+1);
                    });
                })(0);
            } else {
                res.redirect('/veiculos/' + id);
            }
        });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Veiculo.delete(id, (err) => {
            if (err) return res.status(500).json({ error: err });
            res.redirect('/veiculos');
        });
    }
};

module.exports = veiculoController;
