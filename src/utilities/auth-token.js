import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;
const options = { expiresIn: '7d' };

const authToken = {
  generateToken(payload) {
    const token = jwt.sign(payload, secretKey, options);
    return token;
  },

  verifyToken(token) {
    const decodedPayload = jwt.verify(token, secretKey);
    return decodedPayload;
  },
};

export default authToken;
