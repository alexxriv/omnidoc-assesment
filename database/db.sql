CREATE DATABASE database_cash_machine;

USE database_cash_machine;

CREATE TABLE users(
    id INT(11) NOT NUlL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    debit INT(11) NOT NULL,
    credit INT(11) NOT NULL,
    credit_debt INT(11) NOT NULL DEFAULT 0,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users 
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;