import db from '..';
import moment from 'moment-timezone';

const seedAccountTable = async () => {
  const query = `
  INSERT INTO account
    (account_number, created_on, owner_id, account_type, account_status, opening_balance, balance)
  VALUES
    ('1111111111', '${moment().tz('Africa/Lagos').format()}', 3, 'savings', 'draft', 500.00, 0.00),
    ('2222222222', '${moment().tz('Africa/Lagos').format()}', 3, 'savings', 'active', 500.00, 500.00),
    ('3333333333', '${moment().tz('Africa/Lagos').format()}', 3, 'current', 'dormant', 500.00, 0.00);
`;

  try {
    await db.query(query);
  } catch (err) {
    console.log('Seed-Account-Table-Error: ', err.message);
  }
};

export default seedAccountTable;
