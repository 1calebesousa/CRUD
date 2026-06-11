-- Migration: 003_create_conversas.sql
-- Cria a tabela `conversas` para conversas por veículo

CREATE TABLE IF NOT EXISTS conversas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    veiculo_id INT NOT NULL,
    visitor_identifier VARCHAR(255) DEFAULT NULL, -- identificador do visitante (cookie, email, telefone ou guest id)
    user_id INT DEFAULT NULL, -- se o visitante for um usuário cadastrado
    admin_id INT DEFAULT NULL, -- atendente responsável (opcional)
    status ENUM('aberta','arquivada','fechada') NOT NULL DEFAULT 'aberta',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
    INDEX idx_veiculo (veiculo_id),
    INDEX idx_status (status)
);
