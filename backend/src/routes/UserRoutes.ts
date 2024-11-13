import express from 'express';
import UserController from "../controllers/UserController";

const userRoutes = express.Router();
const userController = new UserController();

userRoutes.get('/users', (req, res) => userController.getUsers(req, res));
userRoutes.post('/users', (req, res) => userController.createUser(req, res));

export default userRoutes;