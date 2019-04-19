// "CREATE TYPE accounttype AS ENUM('Savings', 'savings', 'Current', 'current');"
// "CREATE TYPE statustype AS ENUM('Active', 'active', 'Dormant', 'dormant', 'Draft', 'draft');"

const createTable = `
  CREATE TABLE IF NOT EXISTS account(
    id SERIAL UNIQUE,
    account_number VARCHAR (10) PRIMARY KEY,
    created_on TIMESTAMPTZ NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_type ACCOUNTTYPE NOT NULL,
    account_status STATUSTYPE NOT NULL,
    opening_balance NUMERIC (19, 4) NOT NULL,
    balance NUMERIC (19, 4) NOT NULL
  );
`;

const dropTable = 'DROP TABLE IF EXISTS account;';

export { createTable, dropTable };
require('make-runnable');
