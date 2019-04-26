import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import winston from 'winston';
import { config } from 'dotenv';
import mountRoutes from './routes';
import trimRequestObjectValues from './middlewares/trim-string';
import handleServerError from './middlewares/handle-server-error';

config();
const app = express();
const port = process.env.PORT || 3000;
const serverMsg = `Starting development server... http://localhost:${port}`;

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trimRequestObjectValues);

// routes
mountRoutes(app);

// server error handler middleware
app.use(handleServerError);

// server
app.listen(port, () => winston.info(serverMsg));

export default app;
