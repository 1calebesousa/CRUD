const Produto = require('../models/produtoModel');
const Categoria = require('../models/categoriaModel');

const produtoController = {

    createProduto: (req, res) => {

        const newProduto = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria
        };

        Produto.create(newProduto, (err, produtoId) => {
            if (err) {
                res.flash('error', 'Erro ao criar produto.');
                return res.redirect('/produtos/new');
            }
            res.flash('success', 'Produto criado com sucesso.');
            res.redirect('/produtos');
        });
    },

    getProdutoById: (req, res) => {
        const produtoId = req.params.id;

        Produto.findById(produtoId, (err, produto) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!produto) {
                return res.status(404).json({ message: 'Produto not found' });
            }
            res.render('produtos/show', { produto });
        });
    },
    
    getAllProdutos: (req, res) => {
        const categoria = req.query.categoria || null;
        
        Produto.getAll(categoria, (err, produtos) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            Categoria.getAll((err, categorias) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.render('produtos/index', { produtos, categorias, categoriaSelecionada: categoria });
            });
        });
    },

    renderCreateForm: (req, res) => {
        Categoria.getAll((err, categorias) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.render('produtos/create', { categorias });
        });
    },

    renderEditForm: (req, res) => {
        const produtoId = req.params.id;

        Produto.findById(produtoId, (err, produto) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!produto) {
                return res.status(404).json({ message: 'Produto not found' });
            }

            Categoria.getAll((err, categorias) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.render('produtos/edit', { produto, categorias });
            });
        });
    },

    updateProduto: (req, res) => {
        const produtoId = req.params.id;
        
        const updatedProduto = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria
        };

        Produto.update(produtoId, updatedProduto, (err) => {
            if (err) {
                res.flash('error', 'Erro ao atualizar produto.');
                return res.redirect('/produtos');
            }
            res.flash('success', 'Produto atualizado com sucesso.');
            res.redirect('/produtos');
        });
    },

    deleteProduto: (req, res) => {
        const produtoId = req.params.id;

        Produto.delete(produtoId, (err) => {
            if (err) {
                res.flash('error', 'Erro ao excluir produto.');
                return res.redirect('/produtos');
            }
            res.flash('success', 'Produto removido com sucesso.');
            res.redirect('/produtos');
        });
    }
};

module.exports = produtoController;