/* eslint-disable no-await-in-loop */
import userModel from '../models/user';
import hashPassword from '../../utilities/hash-password';

const seedUserDb = async () => {
  const users = [
    {
      first_name: 'Admin',
      last_name: 'Banka',
      phone: '2341111111111',
      email: 'admin@domain.com',
      password: 'admin@domain.com',
      type: 'Staff',
      is_admin: 'true',
    },
    {
      first_name: 'Cashier',
      last_name: 'Banka',
      phone: '2341111111111',
      email: 'cashier@domain.com',
      password: 'cashier@domain.com',
      type: 'Staff',
      is_admin: 'false',
    },
    {
      first_name: 'Client',
      last_name: 'Banka',
      phone: '2341111111111',
      email: 'client@domain.com',
      password: 'client@domain.com',
      type: 'Client',
    },
  ];

  for (let i = 0; i < users.length; i += 1) {
    try {
      users[i].password = await hashPassword.generateHash(users[i].password);
      await userModel.create(users[i]);
    } catch (err) {
      console.log('Error from seeding user DB: ', err.message);
    }
  }
};

export default seedUserDb;
