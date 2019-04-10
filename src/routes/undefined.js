import express from 'express';
import HttpResponse from '../utilities/http-response';

const router = express.Router();

router.all('/', (req, res) => {
  HttpResponse.send(res, 404, { error: 'The page you requested for is not available.' });
});

export default router;
