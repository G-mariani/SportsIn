-- Database definition for SportsIn (crud_db)

CREATE DATABASE IF NOT EXISTS `crud_db`;
USE `crud_db`;

-- Users table: authentication and role
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('athlete','company') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Athletes profiles
CREATE TABLE IF NOT EXISTS `athletes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `anoNascimento` INT NOT NULL,
  `genero` ENUM('Masculino','Feminino') NOT NULL,
  `cidade` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(13) NOT NULL UNIQUE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Companies profiles
CREATE TABLE IF NOT EXISTS `companies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `cnpj` VARCHAR(14) NOT NULL UNIQUE,
  `razaoSocial` VARCHAR(150) NOT NULL,
  `cidade` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Sponsorship opportunities
CREATE TABLE IF NOT EXISTS `opportunities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `requirements` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `deadline` DATE,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
);

-- Athlete applications to opportunities
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `athlete_id` INT NOT NULL,
  `opportunity_id` INT NOT NULL,
  `status` ENUM('pending','accepted','rejected') DEFAULT 'pending',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`athlete_id`) REFERENCES `athletes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities`(`id`) ON DELETE CASCADE
);
