-- Create users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_digest VARCHAR(255) NOT NULL CHECK (LENGTH(password_digest) >= 7),
  code CHAR(4) NOT NULL CHECK (code ~ '^\d{4}$'),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create superheros table
DROP TABLE IF EXISTS superheroes CASCADE;
CREATE TABLE superheroes (
  id SERIAL PRIMARY KEY,
  superhero_name VARCHAR(100),
  strength NUMERIC(5,2) DEFAULT 0, -- strength represent the star every completed chores/tasks
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create tasks table
DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  superpower VARCHAR(255), -- tasks or the chores name 'Water the plant'
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  superhero_id INTEGER REFERENCES superheroes(id) ON DELETE CASCADE
);

-- NOTE:
-- Run this script, command is: psql -U your_user -d your_database -f your_file_path