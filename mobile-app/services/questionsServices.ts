import api from "./api"

export const getCommonQuestions = async () => {
    try {
        const response = await api.get("/user/common_questions");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching common questions:", error);
        throw new Error("Failed to fetch common questions");
    }
}

