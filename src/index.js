import express from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
import mountRoutes from './routes';

config();
const app = express();
const port = process.env.PORT || 3000;
const serverMsg = `Starting development server... http://localhost:${port}\n`;

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
mountRoutes(app);

// server
app.listen(port, () => console.log(serverMsg));

export default app;
