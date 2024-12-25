import dotenv from 'dotenv';  // ES Module import syntax
dotenv.config();  // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import axios from 'axios';  // ES Module import for axios

const app = express();

// Enable CORS for specific origin
app.use(cors({
  origin: 'http://localhost:5500',  // Allow only from this origin
  methods: ['GET', 'POST', 'OPTIONS'],  // Allow POST and OPTIONS methods
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  console.log('Received request:', req.body);  // Log incoming request body
  const message = req.body.message;
  const apiKey = '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';
  console.log('Loaded API Key:', process.env.OPENAI_API_KEY);

  if (!apiKey) {
    console.error('API key is missing!');
    return res.status(400).json({ error: 'API key is missing' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const botResponse = response.data.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    res.status(500).json({ error: 'Failed to fetch data from OpenAI' });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
