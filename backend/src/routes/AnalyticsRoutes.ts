import express, { Request, Response } from "express";
import AnalyticsController from "../controllers/AnalyticsController";

const analyticsRoutes = express.Router();
const analyticsController = new AnalyticsController();

analyticsRoutes.put('/analytics/:userid', async (req: Request, res: Response) => {
  try {
    await analyticsController.createOrUpdateDay(req, res);
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

export default analyticsRoutes;
