import express, { Application } from 'express';
import routes from './routes';

const app: Application = express();

// middlewares
app.use(express.json({ limit: '5mb' }));

// paths
app.use(routes);

export default app;
