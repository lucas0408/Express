import express, { Request, Response } from 'express';
import { config } from 'dotenv'
import path from 'path'
import { readFileSync } from 'fs'

config()
const app = express();
app.set(express.static(''))
const url = process.env.API_BASE_URL ?? 'http://localhost'
const port = process.env.API_PORT ?? 3300

app.get('/', (req: Request, res: Response) => {
    const homepagePath = path.join(process.cwd(), 'home.html')
    const homePage = readFileSync(homepagePath)
    return res.status(200).send(homePage);
});

app.listen(port, () => {
    console.log(`Server is running on port ${url}:${port}`);
});