import { User } from "../models/UserModel";
import { Response, Request } from "express";

class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.send(error);
        }
    }
}

export default UserController;