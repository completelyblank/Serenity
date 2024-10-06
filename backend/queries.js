const oracledb = require('oracledb');
const connectToDatabase = require('./db');

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

async function setActive(connection, userID, active, chatID) {
  try {
    const result = await connection.execute(
      `UPDATE members SET is_active = :active WHERE user_id=:userID AND chat_room_id = :chatID`,
      [active, userID, chatID],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result;
  } catch (err) {
    console.error('Error fetching members:', err);
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

async function addMessage(connection, chatID, userID, messageContent) {
  try {
    const result = await connection.execute(
      `INSERT INTO messages(chat_room_id, user_id, message_content)
      VALUES(:chatID, :userID, :content)`,
      [chatID, userID, messageContent],
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if(result.rows) {
      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    console.error('Error adding message:', err);
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

async function fetchQuote(connection) {
  try {
    const result = await connection.execute(
      `SELECT * FROM quotes`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const randomIndex = Math.floor(Math.random() * 200);
    return result.rows[randomIndex];
  } catch (err) {
    console.error('Error fetching users:', err);
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
  console.log(password);
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
    return 1; // Indicate success
  } catch (err) {
    console.error('Error adding quotes:', err);
    throw err; // Rethrow the error to handle it at a higher level
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

async function fetchTokens(connection) {
  try {
    const result = await connection.execute(
      `SELECT token_count FROM users WHERE user_id = :id`,
      [1], // This assumes user_id = 1 for demonstration; modify as needed
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows.length > 0 ? result.rows[0].TOKEN_COUNT : null; // Ensure a valid return
  } catch (err) {
    console.error('Error fetching tokens:', err);
    throw err;
  }
}

module.exports = {
  fetchUsers,
  fetchNumUsers,
  fetchTokens,
  addUser,
  findUser,
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
  isMember
};
