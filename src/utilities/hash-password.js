import bcrypt from 'bcryptjs';

const hashPassword = {
  generateHash(input = '') {
    const hash = bcrypt.hashSync(input, 10);
    return hash;
  },

  verifyPassword(input = '', hash = '') {
    const result = bcrypt.compareSync(input, hash);
    return result;
  },
};

export default hashPassword;
