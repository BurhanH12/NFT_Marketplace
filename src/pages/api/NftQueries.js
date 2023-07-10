const pool = require('./database');

const getNFTs = () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM NFT ORDER BY nftid ASC', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      });
    });
  };

  const getNFTById = (id) => {
    const query = {
      text: 'SELECT * FROM NFT WHERE nftid = $1',
      values: [id],
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

  const getCreatorNameById = (nftid) => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT users.name FROM users JOIN nft ON nft.creator = users.address WHERE nft.nftid = $1', [nftid], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]?.name);
        }
      });
    });
  };
  
  const createNFT = (body) => {
    const { title, hash, price, creator, currentowner, description } = body;
    const query = {
      text: 'INSERT INTO nft (title, hash, price, creator, currentowner, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [title, hash, price, creator, currentowner, description],
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

  const getLastNFTId = () => {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT nftid FROM nft ORDER BY nftid DESC LIMIT 1',
        (error, results) => {
          if (error) {
            console.error('Error retrieving last NFT ID:', error);
            reject(error);
          } else {
            console.log('Query results:', results);
            const lastNFTId = results.rows[0].nftid;
            resolve(lastNFTId);
          }
        }
      );
    });
  };

  const updateNFTOwner = async (nftId, newOwner) => {
    try {
      console.log({newOwner});
      const query = {
        text: 'UPDATE NFT SET currentowner = $1, sold = true, listed = false WHERE nftid = $2',
        values: [newOwner, nftId],
      };
  
      await pool.query(query);
    } catch (error) {
      throw new Error('Failed to update NFT owner: ', error);
    }
  };

  const getNFTsByOwner = async (ownerAddress) => {
    try {
      const query = {
        text: 'SELECT * FROM NFT WHERE currentowner = $1',
        values: [ownerAddress],
      };
  
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Failed to fetch NFTs by owner');
    }
  };

  const updateNFTSoldStatus = async (nftId, price) => {
    try {
      const query = {
        text: 'UPDATE NFT SET sold = false, listed = true, price = $1 WHERE nftid = $2',
        values: [price, nftId],
      };
  
      await pool.query(query);
    } catch (error) {
      throw new Error('Failed to update NFT sold status: ', error);
    }
  };
  
  
  
  

  module.exports = { getNFTs, createNFT, getNFTById, getCreatorNameById, getLastNFTId, updateNFTOwner, getNFTsByOwner, updateNFTSoldStatus };
  