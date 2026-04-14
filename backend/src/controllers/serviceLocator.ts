import { Request, Response } from "express";
import { getNearbyPlaces } from "../services/googleplaces";

export const getNearbyLocationLocation = async (req : Request, res : Response) => {
    try{
        console.log("Received request for nearby locations with query:", req.query);
       const {lat,lon,type} = req.query;
       if(!lat || !lon || !type){
        return res.status(400).json({ error: "Missing required query parameters" });
       }
       const result = await getNearbyPlaces(Number(lat),Number(lon),String(type));
       res.status(200).json({ success: true, data: result });
    }
    catch(error){
        console.error("Error fetching nearby locations:", error);
        res.status(500).json({ error: "Failed to fetch nearby locations" });
    }
}