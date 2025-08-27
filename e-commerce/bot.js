import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure the Google Gemini API
const genAI = new GoogleGenerativeAI("YOUR_GOOGLE_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const generationConfig = {
  temperature: 0.5,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
};

// Function to generate response
async function generateResponse(inputText) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an e-commerce website bot for a shoe store. Make relevant answer to question that user ask. Our store name is Solemate. Answer in polite manner with necessary words only.\nUser: ${inputText}\nResponse: `,
            },
          ],
        },
      ],
      generationConfig,
    });

    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "Sorry, I couldn't process that request.";
  }
}

// API Route
app.post("/ask", async (req, res) => {
  const userInput = req.body.question;
  const response = await generateResponse(userInput);
  res.json({ answer: response });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});