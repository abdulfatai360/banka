import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpResponse from '../utilities/http-response';

const router = express.Router();
dotenv.config();

const secretKey = process.env.JWT_SECRET;

router.post('/expiration', (req, res) => {
  const { token } = req.body;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (/'TokenExpiredError'/i.test(err.name)) {
        return HttpResponse.send(res, 200, { message: 'Token has expired' });
      }
    }

    return HttpResponse.send(res, 400, { error: 'Token still valid' });
  });
});

export default router;
