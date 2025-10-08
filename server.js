const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');
// Routes
const materialRoutes = require('./routes/materials');
const fileRoutes = require('./routes/files');
const reportRoutes = require('./routes/reports');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const salesRoutes = require('./routes/sales');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'dwm-secret', resave: false, saveUninitialized: false }));

// Serve static files from project root (fallback) and frontend build if present
const frontendDist = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
} else {
  app.use(express.static(path.join(__dirname)));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: pkg.version, time: new Date().toISOString() });
});
app.use('/api/materials', materialRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Fallback: Serve index.html for any other route (SPA-style)
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ensure data directories exist (optional for future features)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  fs.mkdirSync(path.join(dataDir, 'uploads'));
  fs.mkdirSync(path.join(dataDir, 'materials'));
  fs.mkdirSync(path.join(dataDir, 'reports'));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});