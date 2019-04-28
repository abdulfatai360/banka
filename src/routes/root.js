import express from 'express';
import HttpResponse from '../utilities/http-response';

const router = express.Router();

router.get('/', (req, res) => {
  HttpResponse.send(res, 200, {
    message: 'Welcome to Banka... a light-weight core banking application.',
  });
});

export default router;
