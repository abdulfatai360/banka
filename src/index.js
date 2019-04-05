import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import auth from './routes/auth';
import accounts from './routes/accounts';

config();
const app = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: res.statusCode,
    message: 'Welcome to Banka!',
  });
});

// other routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/accounts', accounts);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting development server... http://localhost:${port}\n`);
});

export default app;
