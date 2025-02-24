import express from 'express';
import { config } from 'dotenv';
import { userRoutes } from './routes/UserRoutes'; // Sem extensão
import cors from 'cors';

config();
const app = express();
app.use(express.json());
const url = process.env.API_BASE_URL ?? 'http://localhost';
app.use(cors());
const port = process.env.API_PORT ?? 3300;

app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${url}:${port}`);
});