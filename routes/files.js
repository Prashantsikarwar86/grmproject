const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { ensureDirectory, readJsonFile, writeJsonFile } = require('../utils/storage');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
const filesIndexPath = path.join(uploadsDir, 'files.json');
ensureDirectory(uploadsDir);
if (!readJsonFile(filesIndexPath)) writeJsonFile(filesIndexPath, []);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}_${Date.now()}_${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage });

// List files
router.get('/', (req, res) => {
  let list = readJsonFile(filesIndexPath) || [];
  const { pickupId, fileType } = req.query;
  if (pickupId) list = list.filter(f => String(f.pickupId || '') === String(pickupId));
  if (fileType) list = list.filter(f => String(f.fileType || '') === String(fileType));
  res.json(list);
});

// Upload one or many files
router.post('/', upload.array('files', 10), (req, res) => {
  const list = readJsonFile(filesIndexPath) || [];
  const pickupId = req.body.pickupId || null;
  const fileType = req.body.fileType || 'other';

  const added = (req.files || []).map(f => {
    const meta = {
      id: uuidv4(),
      pickupId,
      fileType,
      originalName: f.originalname,
      storedName: path.basename(f.path),
      size: f.size,
      mimeType: f.mimetype,
      uploadedAt: new Date().toISOString()
    };
    list.push(meta);
    return meta;
  });

  writeJsonFile(filesIndexPath, list);
  res.status(201).json({ uploaded: added });
});

// Download by id
router.get('/:id/download', (req, res) => {
  const list = readJsonFile(filesIndexPath) || [];
  const item = list.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'File not found' });
  const fullPath = path.join(uploadsDir, item.storedName);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'File missing on disk' });
  res.download(fullPath, item.originalName);
});

// Delete by id
router.delete('/:id', (req, res) => {
  const list = readJsonFile(filesIndexPath) || [];
  const idx = list.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'File not found' });
  const [item] = list.splice(idx, 1);
  writeJsonFile(filesIndexPath, list);
  const fullPath = path.join(uploadsDir, item.storedName);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  res.json({ success: true });
});

module.exports = router;


