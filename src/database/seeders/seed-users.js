import PasswordHasher from '../../utilities/hash-password';
import db from '..';

const adminHash = PasswordHasher.generateHash('admin@domain.com');
const cashierHash = PasswordHasher.generateHash('cashier@domain.com');
const clientHash = PasswordHasher.generateHash('client@domain.com');
const client2Hash = PasswordHasher.generateHash('client2@domain.com');

/**
 * Populate the users entity table in the database with some data
 *
 * @async
 */
const seedUsersTable = async () => {
  const query = `
  INSERT INTO users
    (first_name, last_name, phone, email, password, type, is_admin)
  VALUES
    ('Admin', 'Banka', '2341111111111', 'admin@domain.com', '${adminHash}', 'Staff', 'true'),
    ('Cashier', 'Banka', '2341111111111', 'cashier@domain.com', '${cashierHash}', 'Staff', 'false'),
    ('Client', 'Banka', '2341111111111', 'client@domain.com', '${clientHash}', 'Client', null),
    ('Client', 'Banka', '2341111111111', 'client2@domain.com', '${client2Hash}', 'Client', null);
  `;

  await db.query(query);
};

export default seedUsersTable;
