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

export const getSingleScheme = async(slug : string) => {
  try {
    const res = await api.get(`/schemes/${slug}`);
    return res.data
  }
  catch(error : any){
      return {
        success : error.customMessage.success,
        message  : error.customMessage.message
      }
  }
}