-- ============================================
-- CRM Lead Management System
-- Database Schema & Seed Data
-- ============================================

-- Create the database (run this manually if it doesn't exist)
CREATE DATABASE IF NOT EXISTS crm_lead_management;
USE crm_lead_management;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  lead_name             VARCHAR(255) NOT NULL,
  company_name          VARCHAR(255),
  email                 VARCHAR(255),
  phone_number          VARCHAR(50),
  lead_source           VARCHAR(100),
  assigned_salesperson   VARCHAR(255),
  status                ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost')
                          NOT NULL DEFAULT 'New',
  estimated_deal_value  DECIMAL(15, 2) DEFAULT 0.00,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  lead_id     INT NOT NULL,
  content     TEXT NOT NULL,
  created_by  VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_lead
    FOREIGN KEY (lead_id) REFERENCES leads(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SEED DATA: Test User
-- ============================================
-- Email:    admin@example.com
-- Password: password123  (bcrypt-hashed below)
INSERT INTO users (email, password) VALUES
  ('admin@example.com', '$2b$10$k3vWWP4fSXIhTJtFMS10ru4W3zDaXbq6rb4H2M3OpxmetLt/GelNu');

-- ============================================
-- SEED DATA: Sample Leads (for testing)
-- ============================================
INSERT INTO leads (lead_name, company_name, email, phone_number, lead_source, assigned_salesperson, status, estimated_deal_value) VALUES
  ('John Smith',     'Acme Corp',       'john@acme.com',       '+1-555-0101', 'Website',   'Alice Johnson',  'New',           15000.00),
  ('Jane Doe',       'TechStart Inc',   'jane@techstart.com',  '+1-555-0102', 'Referral',  'Bob Williams',   'Contacted',     25000.00),
  ('Mike Wilson',    'Global Services', 'mike@globalserv.com', '+1-555-0103', 'LinkedIn',  'Alice Johnson',  'Qualified',     50000.00),
  ('Sarah Brown',    'InnovateTech',    'sarah@innovate.com',  '+1-555-0104', 'Cold Call', 'Charlie Davis',  'Proposal Sent', 75000.00),
  ('David Lee',      'StartUp Hub',     'david@startuphub.io', '+1-555-0105', 'Website',   'Bob Williams',   'Won',          100000.00),
  ('Emily Chen',     'DataFlow Ltd',    'emily@dataflow.com',  '+1-555-0106', 'Referral',  'Alice Johnson',  'Lost',          30000.00),
  ('Robert Taylor',  'CloudNine Co',    'robert@cloudnine.co', '+1-555-0107', 'LinkedIn',  'Charlie Davis',  'New',           45000.00),
  ('Lisa Anderson',  'BrightIdeas',     'lisa@brightideas.io', '+1-555-0108', 'Website',   'Bob Williams',   'Contacted',     60000.00);

-- ============================================
-- SEED DATA: Sample Notes
-- ============================================
INSERT INTO notes (lead_id, content, created_by) VALUES
  (1, 'Initial contact made via website inquiry form. Very interested in our enterprise plan.', 'Alice Johnson'),
  (2, 'Follow-up call scheduled for next week. Decision maker identified.', 'Bob Williams'),
  (3, 'Sent product demo link. Awaiting feedback from their CTO.', 'Alice Johnson'),
  (4, 'Proposal sent for the premium package. Budget approved internally.', 'Charlie Davis'),
  (5, 'Deal closed! Onboarding scheduled for next month.', 'Bob Williams');
