import db from '..';
import moment from 'moment-timezone';

const seedTransactionTable = async () => {
  const query = `
  INSERT INTO transaction
    (created_on, transaction_type, account_number, cashier_id,  amount, old_balance, new_balance)
  VALUES
    ('${moment().tz('Africa/Lagos').format()}', 'credit', '2222222222', 2, 5000.00, 0.00, 5000.00),
    ('${moment().tz('Africa/Lagos').format()}', 'debit', '2222222222', 2, 1500.00, 5000.00, 3500.00);
`;

  try {
    await db.query(query);
  } catch (err) {
    console.log('Seed-Transaction-Table-Error: ', err.message);
  }
};

export default seedTransactionTable;
