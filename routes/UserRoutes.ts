import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import path from 'path';
import { readFileSync, writeFile } from 'fs';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { IUser, ICreateUserDTO, IError } from '../models/Models';
import dbjson from '../server.json';

config();
const userRoutes = express.Router();
userRoutes.use(express.json());
const dbJsonPath = path.resolve(process.cwd(), 'server.json');
const users: IUser[] = dbjson.users;

const writeFileAsync = promisify(writeFile);

userRoutes.get('/api/users', (req: Request, res: Response) => {
    return res.json(users);
});

userRoutes.post('/api/users', async (req: Request, res: Response) => {
    const { name, age }: ICreateUserDTO = req.body;

    if (!name || !age || age < 0) {
        const message = "o usuario precisa de nome e idade";
        const error: IError = { message };
        return res.status(400).json(error);
    }

    const user = { id: randomUUID(), name, age };

    users.push(user);

    res.status(201).json(user);

    try {
        await writeFileAsync(dbJsonPath, JSON.stringify({ ...dbjson, users }));
        console.log('Dados salvos com sucesso');
    } catch (err) {
        console.error('Erro ao salvar dados:', err);
    }
});

userRoutes.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, age }: ICreateUserDTO = req.body;
    
    if (!id) {
        const message = "o usuario precisa de um id";
        const error: IError = { message };
        return res.status(400).json(error);
    }

    const foundUser = users.find(user => user.id === id);

    if (!foundUser) {
        const message = "usuario não encontrado";
        const error: IError = { message };
        return res.status(404).json(error);
    }

    const updatedUser = { ...foundUser, name, age };
    const updatedUsers = users.map(user => user.id === id ? updatedUser : user);
    
    Object.assign(dbjson, { users: updatedUsers });
    
    res.status(200).json(updatedUser);
    
    try {
        await writeFileAsync(dbJsonPath, JSON.stringify({ ...dbjson, users: updatedUsers }));
        console.log('Dados atualizados salvos com sucesso');
    } catch (err) {
        console.error('Erro ao salvar dados atualizados:', err);
    }
});

userRoutes.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
        const message = "o usuario precisa de um id";
        const error: IError = { message };
        return res.status(400).json(error);
    }

    const foundUser = users.find(user => user.id === id);

    if (!foundUser) {
        const message = "usuario não encontrado";
        const error: IError = { message };
        return res.status(404).json(error);
    }

    const updatedUsers = users.filter(user => user.id !== id);
    
    res.status(200).json({ message: "Usuário removido com sucesso" });
    
    try {
        await writeFileAsync(dbJsonPath, JSON.stringify({ ...dbjson, users: updatedUsers }));
        
    } catch (err) {
        console.error('Erro ao salvar dados após remoção:', err);
    }
});

export { userRoutes };