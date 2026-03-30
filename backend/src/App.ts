import express, { Application } from 'express';

import recipeRoutes from './routes/recipeRoutes.js'

const app: Application = express();

app.use(express.json());

app.use("/api/recipe", recipeRoutes);

export default app;