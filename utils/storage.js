const fs = require('fs');
const path = require('path');

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath, 'utf8');
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read JSON file:', filePath, err.message);
    return null;
  }
}

function writeJsonFile(filePath, value) {
  try {
    ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write JSON file:', filePath, err.message);
    return false;
  }
}

module.exports = {
  ensureDirectory,
  readJsonFile,
  writeJsonFile
};


