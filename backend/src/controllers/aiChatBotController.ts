// src/controllers/chat.controller.ts

import { Request, Response } from "express";
import { generateReply } from "../services/aiservices";

export const chatController = async (req: Request, res: Response) => {
  try {
    console.log("Received message:", req.body.message);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await generateReply(message);
  
    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

