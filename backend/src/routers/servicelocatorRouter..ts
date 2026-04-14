import express from "express";
import { getNearbyLocationLocation } from "../controllers/serviceLocator";

const serviceLocatorRouter = express.Router();

serviceLocatorRouter.get("/nearby",getNearbyLocationLocation);

export default serviceLocatorRouter;