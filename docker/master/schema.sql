-- schema.sql
CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(40) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('beekeeper','admin') NOT NULL DEFAULT 'beekeeper',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hive_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE queen_breeds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE hives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hive_type_id INT NOT NULL,
    hive_code VARCHAR(50) NOT NULL UNIQUE,
    apiary_name VARCHAR(120) NOT NULL,
    location VARCHAR(255) NOT NULL,
    note TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hive_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_hive_type FOREIGN KEY (hive_type_id) REFERENCES hive_types(id)
);

CREATE TABLE queens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    queen_breed_id INT NOT NULL,
    queen_code VARCHAR(50) NOT NULL UNIQUE,
    hatch_year INT NOT NULL,
    mark_color ENUM('white','yellow','red','green','blue') NOT NULL,
    origin ENUM('purchased','swarmed','selected','unknown') NOT NULL,
    status ENUM('active','dead','sold') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_queen_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_queen_breed FOREIGN KEY (queen_breed_id) REFERENCES queen_breeds(id)
);

CREATE TABLE queen_hive_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queen_id INT NOT NULL,
    hive_id INT NOT NULL,
    status ENUM('active','ended') NOT NULL DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    CONSTRAINT fk_assign_queen FOREIGN KEY (queen_id) REFERENCES queens(id),
    CONSTRAINT fk_assign_hive FOREIGN KEY (hive_id) REFERENCES hives(id)
);

CREATE TABLE queen_quality_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    user_id INT NOT NULL,
    brood_pattern TINYINT NOT NULL,
    temperament TINYINT NOT NULL,
    productivity TINYINT NOT NULL,
    health TINYINT NOT NULL,
    total_score DECIMAL(4,2) NOT NULL,
    recommendation ENUM('keep','monitor','replace') NOT NULL,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_check_assignment FOREIGN KEY (assignment_id)
        REFERENCES queen_hive_assignments(id),
    CONSTRAINT fk_check_user FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id INT,
    ip_address VARCHAR(45),
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE INDEX idx_hives_user ON hives(user_id);
CREATE INDEX idx_queens_user ON queens(user_id);
CREATE INDEX idx_assign_hive ON queen_hive_assignments(hive_id);
CREATE INDEX idx_assign_queen ON queen_hive_assignments(queen_id);
CREATE INDEX idx_checks_assignment ON queen_quality_checks(assignment_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

INSERT INTO hive_types(name,description) VALUES
('Langstroth','Standard Langstroth hive'),
('Dadant','Dadant hive'),
('DB','DB hive');

INSERT INTO queen_breeds(name,description) VALUES
('Carnica','Apis mellifera carnica'),
('Buckfast','Buckfast'),
('Italian','Apis mellifera ligustica');

-- Replace password hash with a real bcrypt hash before production use.
INSERT INTO users(username,full_name,email,password_hash,role)
VALUES('admin','System Administrator','admin@example.com',
'$2a$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMN0123456789abcd','admin');
