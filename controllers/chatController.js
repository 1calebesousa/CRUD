const Conversa = require('../models/conversaModel');
const Mensagem = require('../models/mensagemModel');

const chatController = {
    openOrGetConversa: (req, res) => {
        const veiculoId = req.params.veiculoId;
        const visitor = req.query.visitor || null; // identificador do visitante (cookie) opcional
        const userId = req.user ? req.user.id : null;

        if (userId) {
            // tentar encontrar conversa do usuário para o veículo
            Conversa.findByVeiculoAndVisitor(veiculoId, userId, (err, conv) => {
                if (err) return res.status(500).json({ error: err });
                if (conv) {
                    Mensagem.getByConversaId(conv.id, (err2, mensagens) => {
                        if (err2) return res.status(500).json({ error: err2 });
                        return res.render('veiculos/chat', { conversa: conv, mensagens, veiculoId, user: req.user });
                    });
                } else {
                    // criar
                    Conversa.create({ veiculo_id: veiculoId, visitor_identifier: visitor, user_id: userId }, (err3, convId) => {
                        if (err3) return res.status(500).json({ error: err3 });
                        Conversa.findById(convId, (err4, conv2) => {
                            if (err4) return res.status(500).json({ error: err4 });
                            res.render('veiculos/chat', { conversa: conv2, mensagens: [], veiculoId, user: req.user });
                        });
                    });
                }
            });
        } else {
            // visitante anônimo: usar visitor identifier na query
            Conversa.findByVeiculoAndVisitor(veiculoId, visitor, (err, conv) => {
                if (err) return res.status(500).json({ error: err });
                if (conv) {
                    Mensagem.getByConversaId(conv.id, (err2, mensagens) => {
                        if (err2) return res.status(500).json({ error: err2 });
                        return res.render('veiculos/chat', { conversa: conv, mensagens, veiculoId, user: null });
                    });
                } else {
                    Conversa.create({ veiculo_id: veiculoId, visitor_identifier: visitor }, (err3, convId) => {
                        if (err3) return res.status(500).json({ error: err3 });
                        Conversa.findById(convId, (err4, conv2) => {
                            if (err4) return res.status(500).json({ error: err4 });
                            res.render('veiculos/chat', { conversa: conv2, mensagens: [], veiculoId, user: null });
                        });
                    });
                }
            });
        }
    }
};

module.exports = chatController;
