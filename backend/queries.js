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
  findUser
};
