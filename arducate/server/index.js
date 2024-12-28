require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { put } = require('@vercel/blob');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/upload-ar-scene', async (req, res) => {
  try {
    const { htmlContent } = req.body;

    // Upload to Vercel Blob
    const blob = await put(`ar-scene-${Date.now()}.html`, htmlContent, {
      contentType: 'text/plain',
      access: 'public', // Makes the file publicly accessible
    });
    console.log('Blob URL:', blob.url); // Log the blob URL
    res.json({ url: blob.url }); // Return the blob URL
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ error: 'Failed to upload AR scene' });
  }
});

// // Serve the AR scene directly from the blob URL
// app.get('/ar-scene/:id', (req, res) => {
//   const sceneId = req.params.id;
//   const blobUrl = `https://lctppczeyuvves7s.public.blob.vercel-storage.com/ar-scene-${sceneId}.html`;
  
//   res.redirect(blobUrl); // Redirect to the blob URL
// });

// app.get('/view-ar-scene/:id', (req, res) => {
//   const sceneContent = scenes.get(req.params.id);
//   if (!sceneContent) {
//     return res.status(404).send('Scene not found');
//   }
  
//   res.setHeader('Content-Type', 'text/html');
//   res.send(sceneContent);
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
