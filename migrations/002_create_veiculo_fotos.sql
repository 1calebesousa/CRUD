-- Migration: 002_create_veiculo_fotos.sql
-- Cria a tabela `veiculo_fotos` para armazenar caminhos e ordem das imagens

CREATE TABLE IF NOT EXISTS veiculo_fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    veiculo_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    ordem INT NOT NULL DEFAULT 0,
    is_principal TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
    INDEX idx_veiculo (veiculo_id),
    INDEX idx_ordem (ordem)
);
