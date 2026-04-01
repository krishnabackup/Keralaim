import api from "./api"

export const getAIResponse = async (message: string) => {
    try {
        const res = await api.post("/ai/chat", { message });
        return res.data.reply;
    } catch (error) {
        console.error("Error getting AI response:", error);
        throw error;
    }
}