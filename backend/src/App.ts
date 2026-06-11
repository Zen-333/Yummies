import express, { Application } from 'express';
import cors from 'cors'
import recipeRoutes from './routes/recipeRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));


app.use(express.json());

app.use("/api/recipe", recipeRoutes);
app.use("/api/user", userRoutes);

export default app;