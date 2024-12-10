import express, { Request, Response } from "express";
import AnalyticsController from "../controllers/AnalyticsController";

const analyticsRoutes = express.Router();
const analyticsController = new AnalyticsController();

analyticsRoutes.put(
  "/analytics/:userid",
  async (req: Request, res: Response) => {
    await analyticsController.createOrUpdateDay(req, res);
  }
);

export default analyticsRoutes;
