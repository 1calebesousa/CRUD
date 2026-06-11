-- Migration: 001_create_veiculos.sql
-- Cria a tabela `veiculos` com campos necessários para o catálogo de veículos

CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    versao VARCHAR(150),
    ano INT,
    ano_modelo INT,
    cor VARCHAR(50),
    combustivel VARCHAR(50),
    cambio VARCHAR(50),
    motorizacao VARCHAR(100),
    quilometragem INT,
    placa VARCHAR(20),
    renavam VARCHAR(50),
    preco DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    descricao TEXT,
    observacoes TEXT,
    portas INT,
    tipo_veiculo VARCHAR(80),
    situacao ENUM('disponivel','vendido','arquivado') NOT NULL DEFAULT 'disponivel',
    video_url VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_marca_modelo (marca(50), modelo(50)),
    INDEX idx_preco (preco),
    INDEX idx_ano (ano)
);
