import express, { Request, Response } from "express";
import ProfileController from "../controllers/ProfileController";

const profileRoutes = express.Router();
const profileController = new ProfileController();

profileRoutes.get("/:userid/profiles", profileController.getProfiles);

profileRoutes.post("/:userid/profiles", async (req: Request, res: Response) => {
  try {
    console.log("Received request in backend..", req.body);
    await profileController.createProfile(req, res);
    console.log("Profile creation process completed.");
    res.status(201).send();
  } catch (error) {
    console.error("Error during profile creation:", error);
    res.status(500).send(error);
  }
});

profileRoutes.put(
  "/:userid/profiles/:profileid",
  async (req: Request, res: Response) => {
    await profileController.updateProfile(req, res);
  }
);

profileRoutes.delete(
  "/:userid/profiles/:profileid",
  async (req: Request, res: Response) => {
    try {
      console.log("Deleting...:", req.body);
      await profileController.deleteProfile(req, res);
    } catch (error) {
      console.error("Error deleting the profile:", error);
      res.status(500).send(error);
    }
  }
);

export default profileRoutes;
