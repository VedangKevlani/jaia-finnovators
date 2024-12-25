import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Middleware to parse JSON bodies
app.use(express.json());

const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
const HF_API_TOKEN = "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"; // Add your token to the .env file

app.get('/', (req, res) => {
  res.send('Welcome to the Mistral AI chatbot server!');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!HF_API_TOKEN) {
    return res.status(400).json({ error: 'Hugging Face API key is missing' });
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error from Hugging Face API:', error);
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const botResponse = data.generated_text || 'Sorry, I couldn’t generate a response.';
    res.json({ response: botResponse });

  } catch (error) {
    console.error('Error communicating with Hugging Face API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Hugging Face API' });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
