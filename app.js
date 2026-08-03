const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const { setUserIfAuthenticated } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(expressLayouts);

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://code.jquery.com",
                    "https://cdn.jsdelivr.net",
                    "https://maxcdn.bootstrapcdn.com"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://maxcdn.bootstrapcdn.com"
                ],
                imgSrc: ["'self'", "data:", "blob:"],
                connectSrc: ["'self'", "ws:", "wss:"]
            }
        }
    })
);

// Rate limiting (basic)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

const flashMiddleware = require('./middleware/flashMiddleware');

app.use(cookieParser());
app.use(flashMiddleware);
app.use(setUserIfAuthenticated);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/admin', adminRoutes);

app.use('/veiculos', veiculoRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

// Socket.IO: evento simples para mensagens por conversa
const Conversa = require('./models/conversaModel');
const Mensagem = require('./models/mensagemModel');

io.on('connection', (socket) => {
    socket.on('join_conversa', (conversaId) => {
        socket.join('conversa_' + conversaId);
    });

    socket.on('send_message', (data) => {
        const { conversa_id, sender_type, sender_id, mensagem } = data;
        // salvar mensagem no banco
        Mensagem.create({ conversa_id, sender_type, sender_id, mensagem, lida: 0 }, (err, insertId) => {
            if (err) {
                socket.emit('error_message', { error: 'Falha ao salvar mensagem' });
                return;
            }
            // emitir para participantes na sala
            io.to('conversa_' + conversa_id).emit('new_message', { id: insertId, conversa_id, sender_type, sender_id, mensagem, created_at: new Date() });
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
