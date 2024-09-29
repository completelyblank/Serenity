const express = require('express');
const { fetchUsers, fetchNumUsers, fetchTokens, addUser, findUser, changeTheme, addQuotes, fetchQuote } = require('./queries'); 
const connectToDatabase = require('./db');
const axios = require('axios');

const router = express.Router();

router.get('/login', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const num = await fetchNumUsers(connection);
    res.json({ num });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        // Close connection
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.get('/form', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const tokens = await fetchTokens(connection);
    res.json({ tokens });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        // Close connection
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.post('/', async (req, res) => {
  const { username, password, isSignup, firstName, lastName, gender, age } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  let connection;
  let status;
  let user;
  try {
    connection = await connectToDatabase();

    if (isSignup) {
      status = await addUser(connection, username, password, firstName, lastName, gender, age);
    } else {
      status = await findUser(connection, username, password);
      if (status === 1) {
        user = await fetchUsers(connection, username);
      }
    }
    res.json({ status, user });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        // Close connection
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.post('/profile', async (req, res) => {
  const { username, theme } = req.body;

  let connection;
  let status;

  try {
    connection = await connectToDatabase();
    status = await changeTheme(connection, theme, username);
    res.json({ status });
  } catch (err) {
    console.error('Error changing theme:', err);
    res.status(500).json({ error: 'Failed to change theme' });
  } finally {
    if (connection) {
      try {
        // Close connection
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.get('/profile', async (req, res) => {
  const { username, theme } = req.body;

  let connection;
  let status;

  try {
    connection = await connectToDatabase();
    status = await fetchQuote(connection);
    res.json({ 
      QUOTEID: status.QUOTEID, 
      QUOTE: status.QUOTE, 
      CATEGORY: status.CATEGORY, 
      AUTHOR: status.AUTHOR 
    });
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  } finally {
    if (connection) {
      try {
        // Close connection
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.get('/api/quotes', async (req, res) => {
  const totalQuotesToFetch = 200; 
  const allQuotes = [];
  let status;
  let connection;
  try {
    for (let i = 0; i < totalQuotesToFetch; i++) {
      const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        headers: { 'X-Api-Key': process.env.API_KEY }
      });

      if (response.data && response.data.length > 0) {
        allQuotes.push(response.data[0]);
      } else {
        break; 
      }
    }
    connection = await connectToDatabase();
    status = await addQuotes(connection, allQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ message: 'Error fetching quotes' });
  }
});


module.exports = router;
