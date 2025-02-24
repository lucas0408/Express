import express, { Request, response, Response } from 'express';
import { config } from 'dotenv'
import path from 'path'
import { readFileSync, writeFile, writeFileSync } from 'fs'
import { randomBytes, randomUUID } from 'crypto';
import {IUser, ICreateUserDTO, IError, } from '../models/Models'
import dbjson from '../server.json'

config()
const userRoutes = express();
userRoutes.use(express.json())
const dbJsonPath = path.resolve(process.cwd(), 'server.json')
const users: IUser[] = dbjson.users

userRoutes.get('/api/users', (req: Request, res: Response) => {
    return res.json(users)
});

userRoutes.post('/api/users', async (req: Request, res: Response) => {
    const {name, age}: ICreateUserDTO = req.body

    if(!name || !age || age < 0){
        const message = "o usuario precisa de nome e idade"
        const error: IError = {message}
        return res.status(400).send(error)
    }

    const user = ({ id: randomUUID(), name, age })

    users.push(user)

    writeFileSync(dbJsonPath, JSON.stringify({...dbjson, users}))

    return res.json(user)
});

userRoutes.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    if( !id ){
        const message = "o usuario precisa de um id"
        const error: IError = {message}
        return res.status(400).send(error)
    }

    const foundUser = users.find(user => user.id === id)

    if(!foundUser){
        const message = "usuario não encontrado"
        const error: IError = {message}
        return response.status(400).send(error)
    }

    const updatedUser = { ...foundUser, ...req.body };

    const updatedUsers = users.map(user => user.id === id ? updatedUser : user)

    writeFileSync(dbJsonPath, JSON.stringify({ ...dbjson, users: updatedUsers }))
});

userRoutes.delete('/api/users', async (req: Request, res: Response) => {
    const { id } = req.params
    if( !id ){
        const message = "o usuario precisa de um id"
        const error: IError = {message}
        return res.status(400).send(error)
    }

    const foundUser = users.find(user => user.id === id)

    if(!foundUser){
        const message = "usuario não encontrado"
        const error: IError = {message}
        return response.status(400).send(error)
    }

    const updatedUsers = users.filter(user => user.id !== id)

    writeFileSync(dbJsonPath, JSON.stringify({ ...dbjson, users: updatedUsers }))

    return res.status(200)
});

export {userRoutes}
