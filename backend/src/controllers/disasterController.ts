import { success } from "../helpers/responseFormat"
import { getWeather } from "../services/disaster/getWeather"
import { Request,Response } from "express"
export const getDisasterAlert = async (req : Request,res : Response) => {
   try{
      const alerts = await getWeather(33.44,-94.04)
      console.log(alerts)
      res.status(200).json(success("Fetched Alerts",alerts))
   }
   catch(error){
    console.log("Error :",error)
   }
}