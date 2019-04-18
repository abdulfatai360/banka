/* eslint-disable no-await-in-loop */
import userModel from '../models/user';
import hashPassword from '../../utilities/hash-password';

const seedUserDb = async () => {
  const users = [
    {
      first_name: 'Abdus',
      last_name: 'Sobur',
      other_name: 'Jimoh',
      phone: '08077073680',
      email: 'abdulfatai360@gmail.com',
      password: 'abdulfatai360',
      type: 'Staff',
      is_admin: 'true',
    },
    {
      first_name: 'Ajayi',
      last_name: 'Ganiyah',
      other_name: 'Adeola',
      phone: '08077073680',
      email: 'ganiyah.adeola@gmail.com',
      password: 'ganiyah.adeola@gmail.com',
      type: 'Staff',
      is_admin: 'false',
    },
    {
      first_name: 'Abdul',
      last_name: 'Fatai',
      other_name: 'Jimoh',
      phone: '08077073680',
      email: 'oluphetty@gmail.com',
      password: 'oluphetty@gmail.com',
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
