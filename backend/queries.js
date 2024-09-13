const oracledb = require('oracledb');
const connectToDatabase = require('./db');

async function fetchUsers(connection) {
  try {
    const result = await connection.execute(
      `SELECT * FROM users`, // query
      [], // bind variables
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // output format
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function fetchNumUsers(connection) {
  try {
    const result = await connection.execute(
      `SELECT COUNT(*) AS user_count FROM users`, // query with alias
      [], // bind variables
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // output format
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

    if (Array.isArray(result.rows) && result.rows.length > 0) {
      const passwordFetched = result.rows[0].PASSWORD;
      if (password === passwordFetched) {
        return 1; // Password match
      } else {
        return 0; // Password mismatch
      }
    } else {
      return 0; // User not found
    }
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function addUser(connection, username, password, first_name, last_name, gender, age) {
  console.log(first_name);
  try {
    const result = await connection.execute(
      `SELECT * FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (Array.isArray(result.rows) && result.rows.length === 0) {
      // Use parameterized query to insert user
      if (gender == 'Male') {
        gender = 'M';
      } else {
        gender = 'F';
      }
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
    console.error('Error fetching users:', err);
    throw err;
  }
}

async function fetchTokens(connection) {
  try {
    const result = await connection.execute(
      `SELECT token_count FROM users WHERE user_id = :id`, // query
      [1], // bind variables
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // output format
    );
    return result.rows[0].TOKEN_COUNT;
  } catch (err) {
    console.error('Error fetching num users:', err);
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
