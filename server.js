const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Define a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Define a route to delete all files in the uploads directory
app.delete('/delete', (req, res) => {
  const directory = 'uploads/';

  fs.readdir(directory, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) {
          return res.status(500).send('Error deleting file');
        }
      });
    }

    res.send('All files deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
