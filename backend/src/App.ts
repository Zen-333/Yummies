import express, { Application } from 'express';

import recipeRoutes from './routes/recipeRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app: Application = express();

app.use(express.json());

app.use("/api/recipe", recipeRoutes);
app.use("/api/user", userRoutes);

export default app;