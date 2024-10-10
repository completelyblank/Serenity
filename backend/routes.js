const express = require('express');
const { fetchUsers, fetchNumUsers, fetchTokens, addUser, findUser, changeTheme, addQuotes, fetchQuote, changePassword, deleteAccount, fetchMembers, setActive, getMessages, addMessage, deleteMessage, isMember, fetchLastActive, sendRequest, checkRequest } = require('./queries');
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

router.get('/chatroom/:chatID', async (req, res) => {
  const chatID = req.params.chatID;
  const userID = req.query.userID;
  let connection;
  try {
    connection = await connectToDatabase();
    const members = await fetchMembers(connection, chatID);
    const messages = await getMessages(connection, chatID);
    const lastActive = await fetchLastActive(connection, userID, chatID);
    res.json({ members, messages, lastActive });
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

router.post('/chatroom/:chatID/message', async (req, res) => {
  const chatID = req.params.chatID;
  const { userID, messageContent } = req.body;
  let connection;

  try {
    connection = await connectToDatabase();
    
    // Get the current time and date
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString(); // Format date as ISO string

    // Add the message to the database
    const status = await addMessage(connection, chatID, userID, messageContent, time, dateString);

    // Prepare the response object to return to the client
    const responseMessage = {
      USER_ID: userID,
      MESSAGE_CONTENT: messageContent,
      SENT_TIME: time,
      SENT_DATE: dateString,
    };

    res.json(responseMessage);
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Failed to update data' });
  } finally {
    if (connection) {
      try {
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});

router.post('/chatroom/:chatID/delete', async (req, res) => {
  const { messageID } = req.body;
  let connection;

  try {
    connection = await connectToDatabase();
  
    const status = await deleteMessage(connection, messageID);

    res.json(status);
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Failed to delete data' });
  } finally {
    if (connection) {
      try {
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
});


router.post('/chatroom/:chatID', async (req, res) => {
  const chatID = req.params.chatID;
  const { userID, active } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const status = await setActive(connection, userID, active, chatID);
    res.json({ status });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Failed to update data' });
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

router.post('/profile/theme', async (req, res) => {
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

router.post('/profile/password', async (req, res) => {
  const { username, password } = req.body;

  let connection;
  let status;

  try {
    connection = await connectToDatabase();
    status = await changePassword(connection, username, password);
    res.json({ status });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
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

router.post('/profile/delete', async (req, res) => {
  const { username } = req.body;

  let connection;
  let status;

  try {
    connection = await connectToDatabase();
    status = await deleteAccount(connection, username);
    res.json({ status });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ error: 'Failed to delete account' });
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

router.get('/blog/checkMember', async (req, res) => {
  const {userID, chatRoomID} = req.query;
  let connection;
  try {
    connection = await connectToDatabase();
    const member = await isMember(connection, userID, chatRoomID);
    const requestCheck = await checkRequest(connection, userID, chatRoomID);
    res.json({ member, requestCheck });
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

router.post('/blog/request', async (req, res) => {
  const { userID, chatRoomID, checkStatus } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const requestSend = await sendRequest(connection, userID, chatRoomID, checkStatus);
    res.json({ requestSend });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Failed to update data' });
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

module.exports = router;
