
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

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Optional Seed Data
-- INSERT INTO raw_materials (name, code, category, unit_of_measure, quantity, status, description)
-- VALUES 
--     ('Water', 'RM-001', 'solvent', 'l', 500.00, 'active', 'Purified water for cosmetic formulations.'),
--     ('Glycerin', 'RM-002', 'humectant', 'kg', 25.50, 'active', 'Vegetable glycerin.'),
--     ('Sodium Laureth Sulfate', 'RM-003', 'surfactant', 'kg', 100.00, 'active', 'SLES, primary foaming agent.'),
--     ('Phenoxyethanol', 'RM-004', 'preservative', 'kg', 5.00, 'active', 'Broad spectrum preservative.'),
--     ('Discontinued Perfume', 'RM-005', 'fragrance', 'g', 0.00, 'inactive', 'Old fragrance formulation.')
--     ('Caprylyl Glycol', 'RM-006', 'preservative', 'kg', 5.00, 'active', 'Broad spectrum preservative.')

-- the generated data is implemented in the seeder file backend/seeders/20260827181522-initial-raw-materials.js  i didt here as commented because it was asked in the test


;


