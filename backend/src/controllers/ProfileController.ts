import ProfileServices from "../services/ProfileServices";
import { Response, Request } from "express";

class ProfileController {
    async getProfiles(req: Request, res: Response) {
        try {
            const profiles = await ProfileServices.getProfiles();
            res.json(profiles);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            res.send(error);
        }
    }

    async createProfile (req: Request, res: Response) {
        try {
            console.log('Received request..', req.body);
            const { userid, title, deskHeight, timer_standing, timer_sitting  } = req.body;
            const profiles = await ProfileServices.createProfile(userid, title, deskHeight, timer_standing, timer_sitting);
            res.json(profiles);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            res.send(error);
        }
    }

    async deleteProfile (req: Request, res: Response) {
        try {
            const { profileid } = req.params;
            const deleted = await ProfileServices.deleteProfile(profileid);
            if (deleted) {
                res.status(200).send({ message: `Profile ${profileid} deleted successfully.` });
            } else {
                res.status(404).send({ message: `Profile ${profileid} not found.` });
            }
        }
        catch (error) {
            console.error('Error deleting profile:', error);
            res.send(error);
        }
    }
}

export default ProfileController;