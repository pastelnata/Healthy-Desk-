import { User } from "../models/UserModel";
import { Request, Response } from 'express';
import UserService from '../services/UserService'; // Adjust the path as necessary

class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send(error);
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const { username, email, password, height, mot_lvl } = req.body;
            console.log('Received request to create user with data:', req.body);
            const newUser = await UserService.createUser(username, email, password, height, mot_lvl);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send(error);
        }
    }

    //Log in user 

    async loginUser(req: Request, res: Response) {
        try {
            const {username, password} = req.body;
            console.log('Received request to check for username and password:', req.body);
            const userData = await UserService.loginUser(username, password);
    
            // Error when login credentials are wrong
            if (!userData) {
                return res.status(401).json({ success: false, message: 'Wrong login credentials' });
            }

            const isManager = (userData.constructor.name === 'Manager');
            return res.status(200).json({ success: true, user: userData, isManager });
            
        } catch (error) {
            console.log("Error in loginUser controller:", error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    }
    
}

export default UserController;