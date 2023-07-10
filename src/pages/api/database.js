const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test_nftmp',
  password: 'burhanq123',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
