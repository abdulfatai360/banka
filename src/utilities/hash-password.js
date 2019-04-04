import '@babel/polyfill';
import bcrypt from 'bcryptjs';

const hashPassword = {
  async generateHash(input = '') {
    const hash = await bcrypt.hash(input, 10);
    return hash;
  },

  async verifyPassword(input = '', hash = '') {
    const result = await bcrypt.compare(input, hash);
    return result;
  },
};

export default hashPassword;
