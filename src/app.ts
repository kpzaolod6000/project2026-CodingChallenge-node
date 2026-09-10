import express, { Application } from 'express';
import routes from './routes';

const app: Application = express();

// Middlewares
app.use(express.json({ limit: '5mb' }));

// Rutas
app.use(routes);

export default app;
