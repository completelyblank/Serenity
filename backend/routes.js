const express = require('express');
const { fetchUsers, fetchNumUsers, fetchTokens, addUser, findUser } = require('./queries'); 
const connectToDatabase = require('./db');

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
        
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.post('/', async (req, res) => {
  const {username, password, isSignup, firstName, lastName, gender, age} = req.body;
  
  // if empty
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  let connection;
  let status;
  try {
    connection = await connectToDatabase();
    
    if (isSignup) {
      status = await addUser(connection, username, password, firstName, lastName, gender, age);
    } else {
      status = await findUser(connection, username, password);
    }

    res.json({ status });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

module.exports = router;
