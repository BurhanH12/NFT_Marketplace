const pool = require('./database');

const getUsers = () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM users ORDER BY name ASC', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });
  };

  const currentUser = (address) => {
    const query = {
      text: 'SELECT name FROM users WHERE address = $1',
      values: [address],
    };
  
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]);
        }
      });
    });
  };

  
  const createUser = (body) => {
    return new Promise((resolve, reject) => {
      const { address, name, email } = body;
      pool.query('INSERT INTO users (address, name, email) VALUES ($1, $2, $3) RETURNING *', [address, name, email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(`A new user has been added: ${JSON.stringify(results.rows[0])}`);
        }
      });
    });
  };
  
  module.exports = { getUsers, createUser, currentUser };