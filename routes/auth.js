const express = require('express');
const session = require('express-session');
const { findUserByUsername, createUser, verifyPassword } = require('../utils/auth');

const router = express.Router();

// Ensure default admin
createUser({ username: 'admin', password: 'admin123', role: 'admin', fullName: 'Admin' });

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = findUserByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { id: user.id, username: user.username, role: user.role, fullName: user.fullName };
  res.json({ user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(()=> res.json({ success: true }));
});

router.get('/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

module.exports = router;


