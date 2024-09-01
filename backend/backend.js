require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the BERTweet Sentiment Analysis API!');
});

app.post('/analyze-sentiment', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis',
      { inputs: text },
    );

    const sentiment = response.data[0].label;
    res.send({ sentiment });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error analyzing sentiment' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
