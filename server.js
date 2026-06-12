const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 8080;

// Reverse Proxy: Forward all /api requests to the Cloud Run backend
app.use('/api', createProxyMiddleware({
  target: 'https://flask-app-dvovxpdruq-uc.a.run.app',
  changeOrigin: true
}));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback to index.html for non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
