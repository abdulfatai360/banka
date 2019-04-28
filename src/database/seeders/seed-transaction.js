import db from '..';
import moment from 'moment-timezone';

/**
 * Populate the transaction entity table in the database with some data
 *
 * @async
 */
const seedTransactionTable = async () => {
  const query = `
  INSERT INTO transaction
    (created_on, transaction_type, account_number, cashier_id,  amount, old_balance, new_balance)
  VALUES
    ('${moment().tz('Africa/Lagos').format()}', 'credit', '2222222222', 2, 5000.00, 0.00, 5000.00),
    ('${moment().tz('Africa/Lagos').format()}', 'debit', '2222222222', 2, 1500.00, 5000.00, 3500.00);
  `;

  await db.query(query);
};

export default seedTransactionTable;
