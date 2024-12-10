import express, { Request, Response } from "express";
import ProfileController from "../controllers/ProfileController";

const profileRoutes = express.Router();
const profileController = new ProfileController();

profileRoutes.get('/profiles', profileController.getProfiles);

profileRoutes.post('/profiles', async (req: Request, res: Response) => {
    try {
        console.log('Received request in backend..', req.body);
        await profileController.createProfile(req, res);
        console.log('Profile creation process completed.');
        res.status(201).send();
    } catch (error) {
        console.error('Error during profile creation:', error);
        res.status(500).send(error);
    }
});

profileRoutes.delete('/profiles/:profileid', async (req: Request, res: Response) => {
    try {
        console.log('Deleting...:', req.body);
        await profileController.deleteProfile(req, res);
    } catch (error) {
        console.error('Error deleting the profile:', error);
        res.status(500).send(error);
    }
});



export default profileRoutes;