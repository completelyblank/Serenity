const express = require('express');
const { deleteInteraction, fetchTagUsage, fetchLogTimes, fetchMoods, fetchUsers, fetchNumUsers, fetchTokens, addUser, findUser, updateTokens, checkLogged, makeAdmin, deleteRequest, addTags, sendFormData, changeTheme, deleteMember, acceptRequest, addQuotes, fetchQuote, getAdmin, changePassword, deleteAccount, fetchMembers, setActive, getMessages, addMessage, deleteMessage, isMember, fetchLastActive, sendRequest, checkRequest, getRequests, fetchSentiments, fetchPosts, fetchReplies, addPost, deletePost, deleteReply, addReply, fetchInteractions, addInteraction, updateInteraction, fetchPostInteractions, isFirstLog, fetchAllInteractions } = require('./queries');
const connectToDatabase = require('./db');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

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
  }
});

router.get('/form', async (req, res) => {
  const userID = req.query.userID;
  const date = new Date();
  const dateToday = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  let connection;
  try {
    connection = await connectToDatabase();
    const tokens = await fetchTokens(connection, userID);
    const todayLogging = await checkLogged(connection, userID, dateToday);
    const newUser = await isFirstLog(connection, userID);
    res.json({ tokens, todayLogging, isFirstLog });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/form', async (req, res) => {
  const { userID, description, emojiID, tags } = req.body;
  let connection;

  try {
    // Connect to the database
    connection = await connectToDatabase();

    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, 'nlp.py');
    const moodDataJson = JSON.stringify({ MOOD_DESCRIPTION: description });

    // Spawn the Python process
    const pythonProcess = spawn('python', [pythonScriptPath]);

    // Write the mood data to the Python script's stdin
    pythonProcess.stdin.write(moodDataJson);
    pythonProcess.stdin.end();

    let sentimentResults = '';

    // Collect data from the Python script's stdout
    pythonProcess.stdout.on('data', (data) => {
      sentimentResults += data.toString();
    });

    // Handle errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error executing Python script:', data.toString());
    });

    // When the Python process closes
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Failed to analyze sentiment' });
      }

      try {
        // Parse the sentiment analysis result
        const parsedSentimentResults = JSON.parse(sentimentResults);
        const sentiment = parsedSentimentResults.SENTIMENT;

        // Now call sendFormData with the sentiment
        const formID = await sendFormData(connection, userID, description, emojiID, sentiment);
        const tagSubmit = await addTags(connection, formID, tags);

        // Respond with the results
        res.json({ tagSubmit });
      } catch (err) {
        console.error('Error parsing sentiment results:', err);
        res.status(500).json({ error: 'Failed to parse sentiment analysis results' });
      }
    });

  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/form/tokens', async (req, res) => {
  const { userID, tokens } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const tokenSet = await updateTokens(connection, tokens, userID, 1);
    res.json({ tokenSet });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/profile/tokens', async (req, res) => {
  const { userID } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const tokenSet = await updateTokens(connection, 1, userID, 0);
    res.json({ tokenSet });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
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
    const requests = await getRequests(connection, chatID);
    res.json({ members, messages, lastActive, requests });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/analysis', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const moods = await fetchMoods(connection);
    const logs = await fetchLogTimes(connection);
    const tags = await fetchTagUsage(connection);
    res.json({ moods, logs, tags });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
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
  }
});

router.post('/chatroom/:chatID/deleteRequest', async (req, res) => {
  const { userID } = req.body;
  const chatID = req.params.chatID;
  let connection;

  try {
    connection = await connectToDatabase();
    const status = await deleteRequest(connection, userID, chatID);
    res.json(status);
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

router.post('/chatroom/:chatID/leave', async (req, res) => {
  const { userID, admin } = req.body;
  const chatID = req.params.chatID;
  let connection;
  try {
    connection = await connectToDatabase();
    if (admin != 0) {
      const makingAdmin = await makeAdmin(connection, admin, chatID);
    }
    const status = await deleteMember(connection, userID, chatID);
    res.json(status);
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

router.post('/chatroom/:chatID/acceptRequest', async (req, res) => {
  const { userID } = req.body;
  const chatID = req.params.chatID;
  let connection;
  try {
    connection = await connectToDatabase();
    const adding = await acceptRequest(connection, userID, chatID);
    const status = await deleteRequest(connection, userID, chatID);
    res.json(status);
  } catch (err) {
    console.error('Error accepting request:', err);
    res.status(500).json({ error: 'Failed to accept request' });
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
  }
});

router.get('/profile', async (req, res) => {
  const { userID } = req.query;
  let connection;
  let status;
  try {
    connection = await connectToDatabase();
    status = await fetchQuote(connection);
    sentiments = await fetchSentiments(connection, userID);

    res.json({
      QUOTEID: status.QUOTEID,
      QUOTE: status.QUOTE,
      CATEGORY: status.CATEGORY,
      AUTHOR: status.AUTHOR,
      sentiments
    });



  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
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
  const { userID, chatRoomID } = req.query;
  let connection;
  try {
    connection = await connectToDatabase();
    const member = await isMember(connection, userID, chatRoomID);
    const admin = await getAdmin(connection, chatRoomID);
    const requestCheck = await checkRequest(connection, userID, chatRoomID);
    res.json({ member, requestCheck, ADMIN_ID: admin.ADMIN_ID });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/blog', async (req, res) => {
  const { categoryName } = req.query;
  let connection;
  try {
    connection = await connectToDatabase();
    if (categoryName === "All Categories") {
      const general = await fetchPosts(connection, "General");
      const advice = await fetchPosts(connection, "Advice");
      const questions = await fetchPosts(connection, "Questions");
      const discussion = await fetchPosts(connection, "Discussions");
      const allPosts = [
        ...general,
        ...advice,
        ...questions,
        ...discussion
      ];
      allPosts.sort((a, b) => new Date(b.POST_DATE) - new Date(a.POST_DATE));
      const allInter = await fetchAllInteractions(connection);
      res.json({ posts: allPosts, allInter });
    } else {
      const posts = await fetchPosts(connection, categoryName);
      posts.sort((a, b) => new Date(b.POST_DATE) - new Date(a.POST_DATE));
      const allInter = await fetchAllInteractions(connection);
      res.json({ posts, allInter });
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/blog/replies', async (req, res) => {
  const { userID, postID } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const replies = await fetchReplies(connection, postID);
    const inter = await fetchInteractions(connection, userID, postID);
    const pInter = await fetchPostInteractions(connection, postID);
    const allInter = await fetchAllInteractions(connection);
    res.json({ replies, inter, pInter, allInter });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
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
  }
});

router.post('/blog/interact', async (req, res) => {
  const { userID, postID, flag } = req.body;
  let connection, inter;
  try {
    connection = await connectToDatabase();
    const getInter = await fetchInteractions(connection, userID, postID);
    if(getInter == null) {
      inter = await addInteraction(connection, userID, postID, flag);
    } else if(getInter == flag) {
      inter = await deleteInteraction(connection, userID, postID);
    } else {
      inter = await updateInteraction(connection, userID, postID, flag);
    }
    res.json({ inter });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.post('/blog/post', async (req, res) => {
  const { userID, categoryName, postContent } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const postSend = await addPost(connection, categoryName, userID, postContent);
    res.json({ postSend });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

router.post('/blog/reply', async (req, res) => {
  const { userID, postID, replyContent } = req.body;
  let connection;
  try {
    connection = await connectToDatabase();
    const replySend = await addReply(connection, userID, postID, replyContent);
    res.json({ replySend });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

router.post('/blog/delete', async (req, res) => {
  const { deleteID, flag } = req.body;
  let connection, status;

  try {
    connection = await connectToDatabase();
    if(flag === 1) {
      status = await deletePost(connection, deleteID);
    } else {
      status = await deleteReply(connection, deleteID);
    }
    res.json(status);
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

module.exports = router;
