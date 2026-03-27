import api from "./api"

export const getAllSchemes = async(page : number) => {
  try{
    const res = await api.get(`/schemes?page=${page}`);
    return res.data;
  }
  catch(error){
    console.log("Error : " , error)
  }
}