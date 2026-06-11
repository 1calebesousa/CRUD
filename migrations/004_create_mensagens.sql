-- Migration: 004_create_mensagens.sql
-- Cria a tabela `mensagens` para armazenar mensagens das conversas

CREATE TABLE IF NOT EXISTS mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversa_id INT NOT NULL,
    sender_type ENUM('visitante','admin','sistema') NOT NULL,
    sender_id INT DEFAULT NULL,
    mensagem TEXT NOT NULL,
    lida TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversa_id) REFERENCES conversas(id) ON DELETE CASCADE,
    INDEX idx_conversa (conversa_id),
    INDEX idx_lida (lida)
);
