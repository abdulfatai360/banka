import hashPassword from '../../utilities/hash-password';
import db from '..';

const adminHash = hashPassword.generateHash('admin@domain.com');
const cashierHash = hashPassword.generateHash('cashier@domain.com');
const clientHash = hashPassword.generateHash('client@domain.com');

const seedUsersTable = async () => {
  const query = `
  INSERT INTO users
    (first_name, last_name, phone, email, password, type, is_admin)
  VALUES
    ('Admin', 'Banka', '2341111111111', 'admin@domain.com', '${adminHash}', 'Staff', 'true'),
    ('Cashier', 'Banka', '2341111111111', 'cashier@domain.com', '${cashierHash}', 'Staff', 'false'),
    ('Client', 'Banka', '2341111111111', 'client@domain.com', '${clientHash}', 'Client', null);
`;

  try {
    await db.query(query);
  } catch (err) {
    console.log('Seed-Users-Table-Error: ', err.message);
  }
};

export default seedUsersTable;
