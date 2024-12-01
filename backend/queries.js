const oracledb = require('oracledb');
const connectToDatabase = require('./db');
const { replace } = require('react-router-dom');

async function fetchAllUsers(connection) {
  try {
    const result = await connection.execute(
      `SELECT * FROM users`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function fetchUsers(connection, username) {
  try {
    const result = await connection.execute(
      `SELECT * FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Return the first user if exists, otherwise null
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function fetchLogTimes(connection) {
  try {
    const result = await connection.execute(
      `SELECT TO_CHAR(submit_date, 'HH24') AS hours, COUNT(*) AS count
      FROM form_data
      GROUP BY TO_CHAR(submit_date, 'HH24')
      ORDER BY hours`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

async function fetchTagUsage(connection) {
  try {
    const result = await connection.execute(
      `SELECT T.tag_id, T.tag_name, COUNT(F.tag_id) 
      FROM tags T 
      LEFT JOIN form_tags F ON F.tag_id = T.tag_id 
      GROUP BY T.tag_id, T.tag_name 
      ORDER BY COUNT(F.tag_id) DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.slice(0, 5);
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

async function fetchMoods(connection) {
  try {
    const result = await connection.execute(
      `SELECT E.emoji, COUNT(F.emoji_id) 
      FROM emojis E 
      LEFT JOIN form_data F 
      ON E.emoji_id = F.emoji_id 
      GROUP BY E.emoji`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching moods:', err);
    throw err;
  }
}

async function fetchSentiments(connection, userID) {
  try {
    const result = await connection.execute(
      `SELECT sentiment, COUNT(sentiment) 
      FROM form_data
      WHERE user_id = :userID
      GROUP BY sentiment`,
      [userID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching moods:', err);
    throw err;
  }
}

async function setActive(connection, userID, active, chatID) {
  try {
    const result = await connection.execute(
      `UPDATE members SET is_active = :active WHERE user_id=:userID AND chat_room_id = :chatID`,
      [active, userID, chatID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (active == 0) {
      const timestamp = await connection.execute(
        `UPDATE members SET last_active = CURRENT_TIMESTAMP WHERE user_id = :userID`,
        [userID],
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }

    return result;
  } catch (err) {
    console.error('Error fetching members:', err);
    throw err;
  }
}

async function checkLogged(connection, userID, todayDate) {
  try {
    const result = await connection.execute(
      `SELECT *
      FROM form_data 
      WHERE user_id = :userID 
      AND TO_CHAR(submit_date, 'DD-MM-YYYY') = :todayDate`,
      [userID, todayDate],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.length > 0;

  } catch (err) {
    console.error('Error fetching log:', err);
    throw err;
  }
}

async function getMessages(connection, chatID) {
  try {
    const result = await connection.execute(
      `SELECT m.message_id, u.gender, u.user_id, u.first_name, u.last_name, m.message_content, c.chat_room_id, TO_CHAR(m.sent_date, 'DD Mon YYYY') AS sent_date, TO_CHAR(m.sent_date, 'HH:MI AM') AS sent_time
      FROM users u JOIN messages m ON u.user_id = m.user_id
      JOIN chat_rooms c ON c.chat_room_id = m.chat_room_id
      WHERE c.chat_room_id = :chatID
      ORDER BY m.message_id`,
      [chatID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching members:', err);
    throw err;
  }
}

async function sendRequest(connection, userID, chatRoomID, sendORDelete) {
  try {
    if (sendORDelete == 1) {
      const result = await connection.execute(
        `INSERT INTO requests(user_id, chat_room_id) VALUES(:userID, :chatRoomID)`,
        [userID, chatRoomID],
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return 1;
    } else {
      const result = await connection.execute(
        `DELETE FROM requests WHERE user_id = :userID AND chat_room_id = :chatRoomID`,
        [userID, chatRoomID],
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return 0;
    }
  } catch (err) {
    console.error('Error checking member:', err);
    throw err;
  }
}

async function getRequests(connection, chatRoomID) {
  try {
    const result = await connection.execute(
      `SELECT U.user_id, U.username, U.first_name, U.last_name, U.gender, 
          TO_CHAR(R.request_date, 'DD Mon YYYY') AS sent_date, 
          TO_CHAR(R.request_date, 'HH:MI AM') AS sent_time
          FROM users U 
          JOIN requests R
          ON U.user_id = R.user_id
          WHERE R.chat_room_id = :chatRoomID
          ORDER BY R.request_date DESC`,
      [chatRoomID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (err) {
    console.error('Error getting requests:', err);
    throw err;
  }
}

async function checkRequest(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `SELECT * FROM requests WHERE user_id = :userID AND chat_room_id = :chatRoomID`,
      [userID, chatRoomID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    console.error('Error checking request:', err);
    throw err;
  }
}

async function isMember(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `SELECT * FROM members WHERE user_id = :userID AND chat_room_id = :chatRoomID`,
      [userID, chatRoomID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    console.error('Error checking member:', err);
    throw err;
  }
}

async function getAdmin(connection, chatRoomID) {
  try {
    const result = await connection.execute(
      `SELECT admin_id FROM chat_rooms WHERE chat_room_id = :chatRoomID`,
      [chatRoomID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows[0];
  } catch (err) {
    console.error('Error getting member:', err);
    throw err;
  }
}

async function deleteMessage(connection, messageID) {
  try {
    const result = await connection.execute(
      `DELETE FROM messages WHERE message_id = :msgID`,
      [messageID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting message:', err);
    throw err;
  }
}

async function deletePost(connection, postID) {
  try {
    const result = await connection.execute(
      `DELETE FROM posts WHERE post_id = :postID`,
      [postID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err;
  }
}

async function deleteReply(connection, replyID) {
  try {
    const result = await connection.execute(
      `DELETE FROM replies WHERE reply_id = :replyID`,
      [replyID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting reply:', err);
    throw err;
  }
}

async function deleteRequest(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `DELETE FROM requests WHERE user_id = :userID AND chat_room_id = :chatRoomID`,
      [userID, chatRoomID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting message:', err);
    throw err;
  }
}

async function makeAdmin(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `UPDATE chat_rooms SET admin_id = :userID WHERE chat_room_id = :chatRoomID`,
      [userID, chatRoomID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error making admin:', err);
    throw err;
  }
}

async function deleteMember(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `DELETE FROM members WHERE user_id = :userID AND chat_room_id = :chatRoomID`,
      [userID, chatRoomID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting member:', err);
    throw err;
  }
}

async function acceptRequest(connection, userID, chatRoomID) {
  try {
    const result = await connection.execute(
      `INSERT INTO members(user_id, chat_room_id) VALUES(:userID, :chatRoomID)`,
      [userID, chatRoomID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return 1;
  } catch (err) {
    console.error('Error accepting request:', err);
    throw err;
  }
}

async function addMessage(connection, chatID, userID, messageContent) {
  try {
    const result = await connection.execute(
      `INSERT INTO messages(chat_room_id, user_id, message_content)
      VALUES(:chatID, :userID, :content)`,
      [chatID, userID, messageContent],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    console.error('Error adding message:', err);
    throw err;
  }
}

async function addPost(connection, category, userID, postContent) {
  try {
    const result = await connection.execute(
      `INSERT INTO posts(user_id, post_category, post_content)
      VALUES(:userID, :category, :postContent)`,
      [userID, category, postContent],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return 1;
  } catch (err) {
    console.error('Error adding post:', err);
    throw err;
  }
}

async function addReply(connection, userID, postID, replyContent) {
  try {
    const result = await connection.execute(
      `INSERT INTO replies(user_id, post_id, reply_content)
      VALUES(:userID, :postID, :replyContent)`,
      [userID, postID, replyContent],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return 1;
  } catch (err) {
    console.error('Error adding post:', err);
    throw err;
  }
}

async function sendFormData(connection, userID, description, emojiID, sentiment) {
  try {
    const result = await connection.execute(
      `INSERT INTO form_data(user_id, mood_description, emoji_id, sentiment)
       VALUES(:userID, :description, :emojiID, :sentiment)
       RETURNING form_id INTO :formID`,
      {
        userID,
        description,
        emojiID,
        sentiment,
        formID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.outBinds.formID[0];
  } catch (err) {
    console.error('Error sending data:', err);
    throw err;
  }
}

async function addTags(connection, formID, tagIDs) {
  try {
    for (const tagID of tagIDs) {
      await connection.execute(
        `INSERT INTO form_tags(form_id, tag_id)
         VALUES(:formID, :tagID)`,
        { formID, tagID },
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }

    return 1;
  } catch (err) {
    console.error('Error sending data:', err);
    throw err;
  }
}

async function updateTokens(connection, tokens, userID, add) {
  try {
    if (add === 1) {
      await connection.execute(
        `UPDATE users SET token_count = token_count + :tokens WHERE user_id = :userID`,
        { tokens, userID },
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    } else {
      await connection.execute(
        `UPDATE users SET token_count = token_count - :tokens WHERE user_id = :userID`,
        { tokens, userID },
        { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
    }

    return 1;
  } catch (err) {
    console.error('Error updating data:', err);
    throw err;
  }
}


async function fetchMembers(connection, chatID) {
  try {
    const result = await connection.execute(
      `SELECT u.first_name, u.last_name, u.user_id, u.gender, m.is_active
      FROM members m 
      JOIN users u
      ON u.user_id = m.user_id
      WHERE chat_room_id = :chat_id`,
      [chatID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching members:', err);
    throw err;
  }
}

async function fetchPosts(connection, categoryName) {
  try {
    const result = await connection.execute(
      `SELECT P.user_id, P.post_id, P.post_content, P.post_date, TO_CHAR(P.post_date, 'FMDay, DD Month YYYY') AS p_date, TO_CHAR(P.post_date, 'HH:MI AM') AS p_time, P.post_category, U.username, U.first_name, U.last_name, U.gender
      FROM posts P JOIN users U ON P.user_id = U.user_id
      WHERE post_category = :categoryName
      ORDER BY P.post_date DESC`,
      [categoryName],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw err;
  }
}

async function isFirstLog(connection, userID) {
  try {
    const result = await connection.execute(
      `SELECT * FROM form_data WHERE user_id = :userID`,
      [userID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw err;
  }
}

async function fetchReplies(connection, postID) {
  try {
    const result = await connection.execute(
      `SELECT R.user_id, R.reply_id, R.post_id, R.reply_content, R.reply_date, TO_CHAR(R.reply_date, 'FMDay, DD Month YYYY') AS r_date, TO_CHAR(R.reply_date, 'HH:MI AM') AS r_time, U.username, U.first_name, U.last_name, U.gender
      FROM replies R JOIN users U ON R.user_id = U.user_id
      WHERE post_id = :postID
      ORDER BY R.reply_date`,
      [postID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching replies:', err);
    throw err;
  }
}

async function fetchLastActive(connection, userID, chatID) {
  try {
    const result = await connection.execute(
      `SELECT last_active 
      FROM members M
      WHERE M.user_id = :userID
      AND M.chat_room_id = :chatID`,
      [userID, chatID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows;
  } catch (err) {
    console.error('Error fetching members:', err);
    throw err;
  }
}

async function changeTheme(connection, theme, username) {
  try {
    const result = await connection.execute(
      `UPDATE users SET theme=:theme WHERE username = :username`,
      [theme, username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );

    return 1;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function changePassword(connection, username, password) {
  try {
    const result = await connection.execute(
      `UPDATE users SET password=:password WHERE username = :username`,
      [password, username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );

    return 1;
  } catch (err) {
    console.error('Error changing password:', err);
    throw err;
  }
}

async function deleteAccount(connection, username) {
  try {
    const result = await connection.execute(
      `DELETE FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );

    return 1;
  } catch (err) {
    console.error('Error deleting account:', err);
    throw err;
  }
}

async function addQuotes(connection, quotes) {
  try {
    if (!quotes || quotes.length === 0) {
      throw new Error('No quotes provided');
    }

    for (let i = 0; i < quotes.length; i++) {
      const { category, quote, author } = quotes[i];

      // Check if the quote already exists
      const existingQuoteResult = await connection.execute(
        `SELECT COUNT(*) AS count FROM quotes WHERE quote = :quote AND author = :author`,
        [quote, author],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // If the quote already exists, skip to the next iteration
      if (existingQuoteResult.rows[0].COUNT > 0) {
        console.log(`Skipping duplicate quote: "${quote}" by ${author}`);
        continue; // Skip this quote
      }

      const quoteid = i + 1; // Use the current index for quoteID
      await connection.execute(
        `INSERT INTO quotes (quoteID, category, quote, author) VALUES (:quoteid, :category, :quote, :author)`,
        [quoteid, category, quote, author],
        { autoCommit: true } // Commit the transaction
      );
    }
    return 1;
  } catch (err) {
    console.error('Error adding quotes:', err);
    throw err;
  }
}

async function fetchNumUsers(connection) {
  try {
    const result = await connection.execute(
      `SELECT COUNT(*) AS user_count FROM users`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0].USER_COUNT; // Return the count directly
  } catch (err) {
    console.error('Error fetching num users:', err);
    throw err;
  }
}

async function findUser(connection, username, password) {
  try {
    const result = await connection.execute(
      `SELECT password FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      const passwordFetched = result.rows[0].PASSWORD;
      return password === passwordFetched ? 1 : 0; // Return 1 for match, 0 for mismatch
    }
    return 0; // User not found
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function addInteraction(connection, userID, postID, inter) {
  try {
    const result = await connection.execute(
      `INSERT INTO interactions(user_id, post_id, interaction)
      VALUES(:userID, :postID, :inter)`,
      [userID, postID, inter],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );
    return 1;
  } catch (err) {
    console.error('Error adding interaction:', err);
    throw err;
  }
}

async function addUser(connection, username, password, first_name, last_name, gender, age) {
  try {
    const result = await connection.execute(
      `SELECT * FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      // Use parameterized query to insert user
      gender = gender === 'Male' ? 'M' : 'F'; // Simplified gender assignment
      await connection.execute(
        `INSERT INTO users (username, password, first_name, last_name, gender, age) VALUES (:username, :password, :first, :last, :gender, :age)`,
        [username, password, first_name, last_name, gender, age],
        { autoCommit: true } // Commit transaction
      );
      return 1; // User created
    } else {
      return 0; // User already exists
    }
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
}

async function fetchTokens(connection, userID) {
  try {
    const result = await connection.execute(
      `SELECT token_count FROM users WHERE user_id = :userID`,
      [userID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows.length > 0 ? result.rows[0].TOKEN_COUNT : null; // Ensure a valid return
  } catch (err) {
    console.error('Error fetching tokens:', err);
    throw err;
  }
}

async function fetchInteractions(connection, userID, postID) {
  try {
    const result = await connection.execute(
      `SELECT user_id, interaction FROM interactions
      WHERE user_id = :userID AND post_id = :postID`,
      [userID, postID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].INTERACTION;
  } catch (err) {
    console.error('Error fetching interactions:', err);
    throw err;
  }
}

async function fetchCategory(connection, emojiID) {
  try {
    const result = await connection.execute(
      `SELECT category FROM quote_categories
      WHERE emoji_id = :emojiID`,
      [emojiID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const randomIndex = Math.floor(Math.random() * result.rows.length);
    return result.rows[randomIndex].CATEGORY;
  } catch (err) {
    console.error('Error fetching interactions:', err);
    throw err;
  }
}

async function fetchMostRecentMood(connection, userID) {
  try {
    const result = await connection.execute(
      `SELECT emoji_id FROM form_data
      WHERE user_id = :userID
      ORDER BY submit_date DESC`,
      [userID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].EMOJI_ID;
  } catch (err) {
    console.error('Error fetching interactions:', err);
    throw err;
  }
}

async function fetchQuote(connection, category) {
  try {
    const result = await connection.execute(
      `SELECT * FROM quotes WHERE category = :category`,
      [category],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const randomIndex = Math.floor(Math.random() * result.rows.length);
    return result.rows[randomIndex];
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function fetchAllInteractions(connection) {
  try {
    const result = await connection.execute(
      `SELECT * FROM interactions`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching interactions:', err);
    throw err;
  }
}

async function fetchPostInteractions(connection, postID) {
  try {
    const result = await connection.execute(
      `SELECT 
      COUNT(CASE WHEN interaction = 0 THEN 1 END) AS likes,
      COUNT(CASE WHEN interaction = 1 THEN 1 END) AS dislikes
      FROM interactions
      WHERE post_id = :postID`,
      [postID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching interactions:', err);
    throw err;
  }
}

async function deleteInteraction(connection, userID, postID) {
  try {
    const result = await connection.execute(
      `DELETE FROM interactions WHERE user_id = :userID AND post_id = :postID`,
      [userID, postID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );
    return 1;
  } catch (err) {
    console.error('Error adding interaction:', err);
    throw err;
  }
}

async function updateInteraction(connection, userID, postID, inter) {
  try {
    const result = await connection.execute(
      `UPDATE interactions SET interaction = :inter WHERE user_id = :userID AND post_id = :postID`,
      [inter, userID, postID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
    );
    return 1;
  } catch (err) {
    console.error('Error adding interaction:', err);
    throw err;
  }
}

module.exports = {
  fetchUsers,
  fetchNumUsers,
  fetchTokens,
  addUser,
  findUser,
  deleteRequest,
  changeTheme,
  addQuotes,
  fetchQuote,
  changePassword,
  deleteAccount,
  fetchMembers,
  setActive,
  getMessages,
  addMessage,
  deleteMessage,
  deletePost,
  isMember,
  fetchLastActive,
  sendRequest,
  checkRequest,
  getRequests,
  getAdmin,
  acceptRequest,
  deleteMember,
  deleteReply,
  makeAdmin,
  sendFormData,
  addTags,
  updateTokens,
  checkLogged,
  fetchMoods,
  fetchLogTimes,
  fetchTagUsage,
  fetchSentiments,
  fetchPosts,
  fetchReplies,
  addPost,
  addReply,
  fetchInteractions,
  addInteraction,
  deleteInteraction,
  updateInteraction,
  fetchPostInteractions,
  isFirstLog,
  fetchAllInteractions,
  fetchAllUsers,
  fetchCategory,
  fetchMostRecentMood
};
