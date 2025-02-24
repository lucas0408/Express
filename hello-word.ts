import express, { Request, Response } from 'express';
import { config } from 'dotenv'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { randomBytes, randomUUID } from 'crypto';
import dbjson from './server.json'

config()
const app = express();
app.use(express.json())
const url = process.env.API_BASE_URL ?? 'http://localhost'
const port = process.env.API_PORT ?? 3300
const dbJsonPath = path.resolve(process.cwd(), 'server.json')
const users: IUser[] = dbjson.users

app.get('/api', (req: Request, res: Response) => {
    const homepagePath = path.join(process.cwd(), 'home.html')
    const homePage = readFileSync(homepagePath)
    return res.status(200).send(homePage);
});

app.get('/api/users', (req: Request, res: Response) => {
    return res.json(users)
});

app.post('/api/users', (req: Request, res: Response) => {
    const {name, age}: ICreateUserDTO = req.body

    if(!name || !age || age < 0){
        const message = "o usuario precisa de nome e idade"
        const error: IError = {message}
        return res.status(400).send(error)
    }

    const user = ({ id: randomUUID(), name, age })

    users.push(user)

    writeFileSync(dbJsonPath, JSON.stringify(users))
    
    return res.json(user)
});

app.put('/api/users/{id}', (req: Request, res: Response) => {
    return res.json(users)
});

app.delete('/api/users', (req: Request, res: Response) => {
    return res.json(users)
});

app.listen(port, () => {
    console.log(`Server is running on port ${url}:${port}`);
});