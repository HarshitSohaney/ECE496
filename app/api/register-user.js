// api/register-user.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Store your MongoDB URI in environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await client.connect();
    const database = client.db('yourDatabaseName');
    const collection = database.collection('users');
    const existingUser = await collection.findOne({ userId });

    if (existingUser) {
      return res.status(409).json({ message: 'User already registered' });
    }

    await collection.insertOne({ userId });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
};