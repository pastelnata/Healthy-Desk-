import express from 'express';
import UserController from "../controllers/UserController";

const userRoutes = express.Router();
const userController = new UserController();

userRoutes.use('/users', userController.getUsers);

export default userRoutes;