-- Petify Marketplace Database Schema
-- Run this file against your MySQL instance to set up the database:
--   mysql -u root -p < backend/schema.sql

CREATE DATABASE IF NOT EXISTS petify
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE petify;

-- -------------------------------------------------------
-- users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         CHAR(36)                    NOT NULL,
  full_name  VARCHAR(255)                NOT NULL,
  email      VARCHAR(255)                NOT NULL,
  password   VARCHAR(255)                NOT NULL,  -- bcrypt hash
  role       ENUM('buyer','seller')      NOT NULL,
  created_at DATETIME                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- listings
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS listings (
  id          CHAR(36)                          NOT NULL,
  seller_id   CHAR(36)                          NOT NULL,
  name        VARCHAR(255)                      NOT NULL,
  species     VARCHAR(100)                      NOT NULL,
  breed       VARCHAR(100)                      NOT NULL,
  age_months  INT                               NOT NULL,
  price_usd   DECIMAL(10,2)                     NOT NULL,
  description TEXT,
  photo_url   LONGTEXT,
  status      ENUM('active','sold','deleted')   NOT NULL DEFAULT 'active',
  created_at  DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- orders
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id          CHAR(36)                          NOT NULL,
  buyer_id    CHAR(36)                          NOT NULL,
  seller_id   CHAR(36)                          NOT NULL,
  listing_id  CHAR(36)                          NOT NULL,
  pet_name    VARCHAR(255)                      NOT NULL,
  price_usd   DECIMAL(10,2)                     NOT NULL,
  status      ENUM('confirmed','cancelled')     NOT NULL DEFAULT 'confirmed',
  created_at  DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_seller  FOREIGN KEY (seller_id)  REFERENCES users    (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_listing FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
