const express = require('express');
const path = require('path');
const { readJsonFile } = require('../utils/storage');

const router = express.Router();

const materialsFilePath = path.join(__dirname, '..', 'data', 'materials', 'materials.json');
const salesFilePath = path.join(__dirname, '..', 'data', 'sales', 'sales.json');

router.get('/summary', (req, res) => {
  const pickups = readJsonFile(materialsFilePath) || [];
  const sales = readJsonFile(salesFilePath) || [];
  const totals = pickups.reduce((acc, p) => {
    acc.totalProducts += p?.totals?.totalProducts || 0;
    acc.totalWeight += p?.totals?.totalWeight || 0;
    acc.totalValue += p?.totals?.totalValue || 0;
    return acc;
  }, { totalProducts: 0, totalWeight: 0, totalValue: 0 });

  const byType = {};
  pickups.forEach(p => (p.materials||[]).forEach(m => {
    const key = m.materialType || 'other';
    byType[key] = (byType[key] || 0) + (m.quantity || 0);
  }));

  const today = new Date().toISOString().slice(0,10);
  const soldOverall = sales.reduce((n, s) => n + (s.quantitySold||0), 0);
  const todaySales = sales.filter(s => String(s.date).slice(0,10) === today);
  const soldToday = todaySales.reduce((n, s) => n + (s.quantitySold||0), 0);
  const inventoryLeft = Math.max(0, (totals.totalProducts || 0) - soldOverall);

  res.json({ totals, byType, today: { soldToday, date: today }, soldOverall, inventoryLeft });
});

module.exports = router;


