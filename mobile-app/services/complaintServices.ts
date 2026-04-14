import api from "./api";

export const uploadComplaintImage = async (image : string | null,location : string , description : string , title : string) => {
  try {
     const formData = new FormData();

    formData.append("location", location);
    formData.append("description", description);
    formData.append("title", title);


    if (image) {
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
    }

    const res = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
    } catch (error) {
      console.error("Error uploading complaint image:", error);
        throw error;
    }
}

export const getAllUserComplaints = async() => {
  try {
    console.log("Fetching user complaints...");
    const res = await api.get(`/complaints/user`);
    return res.data.data;
  }
  catch(error) {
    console.error("Error fetching user complaints:", error);
    throw error;
  }
}