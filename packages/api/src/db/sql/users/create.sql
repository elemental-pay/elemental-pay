CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid TEXT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  joined_on timestamptz NOT NULL DEFAULT now(),
  email TEXT
);
