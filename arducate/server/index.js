require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { put } = require('@vercel/blob');

// Verify the token is loaded
console.log('Blob token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

// Store HTML content temporarily (in production, use a proper database)
const scenes = new Map();

app.post('/api/upload-ar-scene', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    const sceneId = Date.now().toString();
    
    // Store the HTML content
    scenes.set(sceneId, htmlContent);

    // Return the local URL that will serve the content
    const url = `http://localhost:3001/ar-scene/${sceneId}`;
    console.log('Scene URL:', url);
    res.json({ url });
  } catch (error) {
    console.error('Error handling AR scene:', error);
    res.status(500).json({ error: 'Failed to handle AR scene' });
  }
});

// Serve the AR scene
app.get('/ar-scene/:id', (req, res) => {
  const sceneContent = scenes.get(req.params.id);
  if (!sceneContent) {
    return res.status(404).send('Scene not found');
  }
  
  res.setHeader('Content-Type', 'text/html');
  res.send(sceneContent);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
