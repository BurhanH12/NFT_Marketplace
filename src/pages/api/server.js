const express = require('express')
const bodyParser = require('body-parser');
const { getUsers, createUser, currentUser } = require('./userQueries')
const { getNFTs, createNFT, getNFTById, getCreatorNameById, getLastNFTId, updateNFTOwner, getNFTsByOwner, updateNFTSoldStatus } = require('./NftQueries')

const app = express()
app.use(bodyParser.json());
const port = 3001

//API to get all the users
app.get('/api/getUsers', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to get all the NFTs
app.get('/api/getNfts', async (req, res) => {
  try {
    const nfts = await getNFTs();
    res.json(nfts);
  } catch (error) {
    console.error('Error retrieving NFTs', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to get NFTs by their ID
app.get('/api/nfts/:id', async (req, res) => {
  const { id } = req.params;

  // Check if the 'id' parameter is valid
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid NFT ID' });
  }

  try {
    const nft = await getNFTById(id);
    if (nft) {
      res.json(nft);
    } else {
      res.status(404).json({ error: 'NFT not found' });
    }
  } catch (error) {
    console.error('Error retrieving NFT:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to get the name of the owner by NFT id
app.get('/api/nfts/:id/creator', async (req, res) => {
  const { id } = req.params;
  try {
    const creatorName = await getCreatorNameById(id);
    if (creatorName) {
      res.json({ name: creatorName });
    } else {
      res.status(404).json({ error: 'Creator not found for the given NFT ID' });
    }
  } catch (error) {
    console.error('Error retrieving creator:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


//API to get the current logged in user
app.get('/api/currentUser', async (req, res) => {
  const { address } = req.query;
  try {
    const user = await currentUser(address);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);

    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to create a new user
app.post('/api/createUser', async (req, res) => {
  try {
    const { address, name, email } = req.body;
    const user = await createUser({ address, name, email }); 
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to create a new NFT
app.post('/api/createNFT', async (req, res) => {
  try {
    const { title, hash, price, creator, currentowner, description } = req.body;
    const nft = await createNFT({ title, hash, price, creator, currentowner, description }); 
    res.status(201).json(nft);
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to get the last Id in the database
app.get('/api/LastnftId', async (req, res) => {
  try {
    const lastNFTIdStr = await getLastNFTId();
    const lastNFTId = parseInt(lastNFTIdStr, 10);
    res.json({ lastNFTId });
  } catch (error) {
    console.error('Error retrieving last NFT ID:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// API to update the current owner and set sold to true for the NFT
app.put('/api/nfts/:id/owner', async (req, res) => {
  const { id } = req.params;
  const { newOwner } = req.body;

  try {
    await updateNFTOwner(id, newOwner);
    res.json({ message: 'NFT owner updated successfully' });
  } catch (error) {
    console.error('Error updating NFT owner:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//API to get all the NFTs owned by a user
app.get('/api/nft/ownedBy/:address', async (req, res) => {
  const { address } = req.params;

  try {
    const nfts = await getNFTsByOwner(address);
    res.json(nfts);
  } catch (error) {
    console.error('Error fetching NFTs by owner:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// API endpoint to update the sold status and price of an NFT
app.put('/api/updnft/:id/sold', async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    await updateNFTSoldStatus(id, price);
    res.json({ message: 'NFT sold status and price updated successfully' });
  } catch (error) {
    console.error('Error updating NFT sold status and Price:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});






app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
