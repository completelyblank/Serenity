const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require("cors");
const path = require('path');
const { spawn } = require('child_process');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Set a default port if not provided

// Middleware for form data and JSON objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS
app.use(cors());

// Use routes
app.use('/', routes);

// Endpoint to generate MP3
app.post('/generate-mp3', (req, res) => {
  const tagPercentages = req.body.tagPercentages; // Expecting percentages from the frontend

  // Handle platform-specific Python command (python3 for Unix-like, python for Windows)
  const isWin = process.platform === 'win32';
  const pythonCommand = isWin ? 'python' : 'python3';

  // Spawn Python process to generate MP3
  const python = spawn(pythonCommand, ['generate_mp3.py', ...tagPercentages]);

  // Handle Python script's stdout
  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  // Handle Python script's stderr
  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle Python script exit event
  python.on('close', (code) => {
    if (code === 0) {
      // Send the generated MP3 file to the client
      const filePath = path.join(__dirname, 'final_mix.mp3');
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(500).send('Error sending MP3 file.');
        }
      });
    } else {
      res.status(500).send('Error generating MP3 file.');
    }
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
