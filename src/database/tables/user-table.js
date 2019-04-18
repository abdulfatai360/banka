// CREATE TYPE usertype AS ENUM('Staff', 'staff', 'Client', 'client');

const createTable = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR (254) UNIQUE NOT NULL,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    phone VARCHAR (15) NOT NULL,
    password VARCHAR (254) NOT NULL,
    type USERTYPE NOT NULL,
    is_admin BOOLEAN
  );
`;

const dropTable = 'DROP TABLE IF EXISTS users CASCADE;';

export { createTable, dropTable };
require('make-runnable');
