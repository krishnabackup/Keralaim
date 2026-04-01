import api from "./api";

export const uploadComplaintImage = async (image : string | null,location : string , description : string) => {
  try {
     const formData = new FormData();

    formData.append("location", location);
    formData.append("description", description);

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