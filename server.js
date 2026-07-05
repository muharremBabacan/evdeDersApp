const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 8080;

// Reverse Proxy: Forward all /api requests to the Cloud Run backend
app.use(createProxyMiddleware({
  target: 'https://flask-app-adxgpabdba-uc.a.run.app',
  changeOrigin: true,
  pathFilter: '/api'
}));

// Clean URLs routing for public subpages
app.get('/moduller', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'moduller.html'));
});
app.get('/fiyatlar', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'fiyatlar.html'));
});
app.get('/videolar', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'videolar.html'));
});
app.get('/ozellikler', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ozellikler.html'));
});
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'blog.html'));
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Fallback to index.html for non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

