import db from '..';

const setUserType = async () => {
  try {
    await db.query("CREATE TYPE usertype AS ENUM('Staff', 'staff', 'Client', 'client');");
  } catch (err) {
    console.log('Err from setting custom data type: ', err.message);
  }
};

setUserType();

const createTable = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR (254) UNIQUE NOT NULL,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    other_name VARCHAR (50),
    phone VARCHAR (11) NOT NULL,
    password VARCHAR (254) NOT NULL,
    type USERTYPE NOT NULL,
    is_admin BOOLEAN
  );
`;

const dropTable = 'DROP TABLE IF EXISTS users;';

export { createTable, dropTable, setUserType };
require('make-runnable');
