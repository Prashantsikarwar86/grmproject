const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ensureDirectory, readJsonFile, writeJsonFile } = require('../utils/storage');

const router = express.Router();

const salesDir = path.join(__dirname, '..', 'data', 'sales');
const salesFile = path.join(salesDir, 'sales.json');
ensureDirectory(salesDir);
if (!readJsonFile(salesFile)) writeJsonFile(salesFile, []);

function todayString() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

// List sales (optional filter by date or pickupId)
router.get('/', (req, res) => {
  let list = readJsonFile(salesFile) || [];
  const { date, pickupId } = req.query;
  if (date) list = list.filter(s => String(s.date).slice(0,10) === String(date));
  if (pickupId) list = list.filter(s => String(s.pickupId) === String(pickupId));
  res.json(list);
});

// Record a sale
router.post('/', (req, res) => {
  const { pickupId, productId, quantitySold, materialType, name } = req.body || {};
  if (!pickupId || !productId || !quantitySold) {
    return res.status(400).json({ error: 'pickupId, productId, quantitySold required' });
  }
  const list = readJsonFile(salesFile) || [];
  const record = {
    id: uuidv4(),
    pickupId: String(pickupId),
    productId: String(productId),
    quantitySold: Number(quantitySold),
    materialType: materialType || null,
    name: name || null,
    date: new Date().toISOString()
  };
  list.push(record);
  writeJsonFile(salesFile, list);
  res.status(201).json(record);
});

module.exports = router;




