CREATE DATABASE kosmetikon;

\c kosmetikon;

CREATE TABLE IF NOT EXISTS raw_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (quantity >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: In a production environment, PostgreSQL automatically manages `updated_at` via triggers if set up, 
-- but here we initialize it to current timestamp.

-- Optional Seed Data
INSERT INTO raw_materials (name, code, category, unit_of_measure, quantity, status, description)
VALUES 
    ('Water', 'RM-001', 'solvent', 'l', 500.00, 'active', 'Purified water for cosmetic formulations.'),
    ('Glycerin', 'RM-002', 'humectant', 'kg', 25.50, 'active', 'Vegetable glycerin.'),
    ('Sodium Laureth Sulfate', 'RM-003', 'surfactant', 'kg', 100.00, 'active', 'SLES, primary foaming agent.'),
    ('Phenoxyethanol', 'RM-004', 'preservative', 'kg', 5.00, 'active', 'Broad spectrum preservative.'),
    ('Discontinued Perfume', 'RM-005', 'fragrance', 'g', 0.00, 'inactive', 'Old fragrance formulation.');
