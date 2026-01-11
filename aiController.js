import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function review(data) {
    console.log("aicontroller started");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a movie Critic with years of experience in movie review, I am giving you a movie data and i want you to review it. tone has to be professional and information should be clear, keep the response short and easy to read for general audience, you can search on the internet to generate factually correct argument.Here is the movie data: ${data} `,
    });
    return response.text;
}