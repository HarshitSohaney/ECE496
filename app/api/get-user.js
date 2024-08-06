// api/get-user.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Store your MongoDB URI in environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await client.connect();
    const database = client.db('yourDatabaseName');
    const collection = database.collection('users');
    const user = await collection.findOne({ userId });

    if (user) {
      res.status(200).json({ message: 'User is registered' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
};