const createTable = `
  CREATE TABLE IF NOT EXISTS transaction(
    id SERIAL PRIMARY KEY,
    created_on TIMESTAMPTZ NOT NULL,
    transaction_type VARCHAR NOT NULL,
    account_number VARCHAR REFERENCES account(account_number) ON DELETE CASCADE,
    cashier_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC (19, 2) NOT NULL,
    old_balance NUMERIC (19, 2) NOT NULL,
    new_balance NUMERIC (19, 2) NOT NULL
  );
`;

const dropTable = 'DROP TABLE IF EXISTS transaction CASCADE;';

export { createTable, dropTable };
require('make-runnable');
