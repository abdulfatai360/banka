import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import rootRoute from './routes/root';
import auth from './routes/auth';
import accounts from './routes/accounts';
import transactions from './routes/transactions';
import undefinedRoute from './routes/undefined';

config();
const app = express();
const port = process.env.PORT || 3000;
const serverMsg = `Starting development server... http://localhost:${port}\n`;

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', rootRoute);
app.use('/api/v1/auth', auth);
app.use('/api/v1/accounts', accounts);
app.use('/api/v1/transactions', transactions);
app.use('/*', undefinedRoute);

// server
app.listen(port, () => console.log(serverMsg));

export default app;
