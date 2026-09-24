import axios from "axios";
import dotenv from 'dotenv'

dotenv.config();

export const getWeather =
async (lat: number, lon: number) => {

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_KEY,
        units: "metric"
      }
    }
  );

  return response.data;
};