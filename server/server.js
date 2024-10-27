const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/tts', async (req, res) => {
  const { text, voice } = req.body;
  console.log('Received request:', { text, voice });

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input: text
    });
    console.log('Audio generated successfully');
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (error) {
    console.log('Server error details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dynamic port finder
const server = app.listen(0, () => {
  const port = server.address().port;
  console.log(`Server is ready and running on port ${port}`);
});