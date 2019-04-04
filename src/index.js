import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import auth from './routes/auth';

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started...listening on port ${port}`);
});

export default app;
