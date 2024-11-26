import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await userController.getUsers(req, res);
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

userRoutes.post('/users', async (req: Request, res: Response) => {
    try {
        await userController.createUser(req, res);
        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

userRoutes.post('/user', async (req: Request, res: Response) => {
    try {
        await userController.loginUser(req, res);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default userRoutes;
