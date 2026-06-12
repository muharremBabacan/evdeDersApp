const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback to index.html if user accesses a route that doesn't map to a static file directly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
