const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { ensureDirectory, readJsonFile, writeJsonFile } = require('./storage');

const usersDir = path.join(__dirname, '..', 'data', 'users');
const usersFile = path.join(usersDir, 'users.json');

function ensureUsersFile() {
  ensureDirectory(usersDir);
  let users = readJsonFile(usersFile);
  if (!users) {
    users = [];
    writeJsonFile(usersFile, users);
  }
  return users;
}

function findUserByUsername(username) {
  const users = ensureUsersFile();
  return users.find(u => u.username === username);
}

function createUser({ username, password, role = 'admin', fullName = 'Admin User' }) {
  const users = ensureUsersFile();
  if (users.some(u => u.username === username)) return true;
  const passwordHash = bcrypt.hashSync(password, 10);
  users.push({ id: String(Date.now()), username, passwordHash, role, fullName, createdAt: new Date().toISOString() });
  writeJsonFile(usersFile, users);
  return true;
}

function verifyPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

module.exports = {
  ensureUsersFile,
  findUserByUsername,
  createUser,
  verifyPassword,
  usersFile
};


