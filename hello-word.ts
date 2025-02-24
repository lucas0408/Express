import express, { Request, Response } from 'express';
import { config } from 'dotenv'
import path from 'path'
import { readFileSync } from 'fs'

config()
const app = express();
app.use(express.static(path.join(__dirname, 'public')))
const url = process.env.API_BASE_URL ?? 'http://localhost'
const port = process.env.API_PORT ?? 3300
const users = [
    {
        name: 'fulano',
        idade: 34
    },
    {
        name: 'ciclano',
        idade: 23
    }
]

app.get('/api', (req: Request, res: Response) => {
    const homepagePath = path.join(process.cwd(), 'home.html')
    const homePage = readFileSync(homepagePath)
    return res.status(200).send(homePage);
});

app.get('/api/users', (req: Request, res: Response) => {
    return res.json(users)
});

app.listen(port, () => {
    console.log(`Server is running on port ${url}:${port}`);
});