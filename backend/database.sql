CREATE DATABASE IF NOT EXISTS smart_mess_system;
USE smart_mess_system;

CREATE TABLE messes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mess_id INT NOT NULL,
    FOREIGN KEY (mess_id) REFERENCES messes(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff', 'admin') DEFAULT 'student',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    hostel_id INT,
    roll_no VARCHAR(50),
    FOREIGN KEY (hostel_id) REFERENCES hostels(id)
);

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type ENUM('allocation_proof', 'fee_receipt') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Dummy Data for initial testing
INSERT INTO messes (name) VALUES ('Mega Mess 1');
INSERT INTO hostels (name, mess_id) VALUES ('Boys Hostel 1', 1);
