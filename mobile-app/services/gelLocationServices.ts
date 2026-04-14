import api from "./api";

export const getLocation = async (lat : number , lon : number , type : string) => {
    console.log("getLocation called with lat:", lat, "lon:", lon, "type:", type);

    const res = await api.get(`/location/nearby/?lat=${lat}&lon=${lon}&type=${type}`);

    const data = res.data.data;
    return data;
}