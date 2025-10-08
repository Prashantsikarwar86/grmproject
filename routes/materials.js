const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJsonFile, writeJsonFile, ensureDirectory } = require('../utils/storage');

const router = express.Router();

const materialsDir = path.join(__dirname, '..', 'data', 'materials');
const materialsFilePath = path.join(materialsDir, 'materials.json');

ensureDirectory(materialsDir);
if (!readJsonFile(materialsFilePath)) {
  writeJsonFile(materialsFilePath, []);
}

function calculateTotals(materials) {
  const totals = materials.reduce(
    (acc, item) => {
      const quantity = Number(item.quantity || 0);
      const weight = Number(item.weight || 0);
      const unitPrice = Number(item.unitPrice || 0);
      const totalValue = Number(item.totalValue || quantity * unitPrice);
      acc.totalProducts += quantity || 0;
      acc.totalWeight += weight || 0;
      acc.totalValue += totalValue || 0;
      return acc;
    },
    { totalProducts: 0, totalWeight: 0, totalValue: 0 }
  );
  return totals;
}

function generatePickupId(existingList) {
  const datePart = new Date().toISOString().slice(2,10).replace(/-/g,'');
  let id;
  let attempts = 0;
  do {
    const rand = Math.floor(1000 + Math.random() * 9000);
    id = `PU${datePart}${rand}`;
    attempts++;
  } while (existingList.some(x => x.pickupId === id) && attempts < 10);
  return id;
}

function normalizeProductIds(materials) {
  return (materials || []).map((m, idx) => ({
    ...m,
    productId: `P${idx + 1}`
  }));
}

// GET all pickups/material entries
router.get('/', (req, res) => {
  const list = readJsonFile(materialsFilePath) || [];
  const { q, page = 1, pageSize = 20 } = req.query;
  let filtered = list;
  if (q) {
    const term = String(q).toLowerCase();
    filtered = list.filter(x =>
      String(x.pickupId).toLowerCase().includes(term) ||
      String(x.clientName || '').toLowerCase().includes(term)
    );
  }
  const p = Math.max(1, parseInt(page));
  const ps = Math.max(1, parseInt(pageSize));
  const start = (p - 1) * ps;
  const items = filtered.slice(start, start + ps);
  res.json({ items, total: filtered.length, page: p, pageSize: ps });
});

// GET by pickupId
router.get('/:pickupId', (req, res) => {
  const list = readJsonFile(materialsFilePath) || [];
  const item = list.find(x => x.pickupId === req.params.pickupId);
  if (!item) return res.status(404).json({ error: 'Pickup not found' });
  res.json(item);
});

// CREATE new pickup/materials
router.post('/', (req, res) => {
  const body = req.body || {};
  const list = readJsonFile(materialsFilePath) || [];

  let pickupId = body.pickupId && String(body.pickupId).trim().length > 0 ? String(body.pickupId) : generatePickupId(list);
  const materials = Array.isArray(body.materials) ? body.materials.map(m=> ({
    ...m,
    name: m.name || '',
  })) : [];

  const totals = calculateTotals(materials);
  if (!body.pickupDate || !body.clientName || !body.clientContact) {
    return res.status(400).json({ error: 'pickupDate, clientName, clientContact are required' });
  }

  const record = {
    id: uuidv4(),
    pickupId,
    pickupDate: body.pickupDate || null,
    clientName: body.clientName || null,
    clientContact: body.clientContact || null,
    vehicleNumber: body.vehicleNumber || null,
    driverName: body.driverName || null,
    vehicleCharges: Number(body.vehicleCharges || 0),
    labourCharges: Number(body.labourCharges || 0),
    materials: normalizeProductIds(materials),
    totals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (list.some(x => x.pickupId === pickupId)) {
    pickupId = generatePickupId(list);
    record.pickupId = pickupId;
  }

  list.push(record);
  writeJsonFile(materialsFilePath, list);
  res.status(201).json(record);
});

// UPDATE pickup
router.put('/:pickupId', (req, res) => {
  const list = readJsonFile(materialsFilePath) || [];
  const idx = list.findIndex(x => x.pickupId === req.params.pickupId);
  if (idx === -1) return res.status(404).json({ error: 'Pickup not found' });

  const prev = list[idx];
  const body = req.body || {};
  const materials = Array.isArray(body.materials) ? body.materials : prev.materials;
  const totals = calculateTotals(materials);

  const updated = {
    ...prev,
    pickupDate: body.pickupDate ?? prev.pickupDate,
    clientName: body.clientName ?? prev.clientName,
    clientContact: body.clientContact ?? prev.clientContact,
    vehicleNumber: body.vehicleNumber ?? prev.vehicleNumber,
    driverName: body.driverName ?? prev.driverName,
    vehicleCharges: body.vehicleCharges !== undefined ? Number(body.vehicleCharges) : prev.vehicleCharges,
    labourCharges: body.labourCharges !== undefined ? Number(body.labourCharges) : prev.labourCharges,
    materials,
    totals,
    updatedAt: new Date().toISOString()
  };

  list[idx] = updated;
  writeJsonFile(materialsFilePath, list);
  res.json(updated);
});

// DELETE pickup
router.delete('/:pickupId', (req, res) => {
  const list = readJsonFile(materialsFilePath) || [];
  const idx = list.findIndex(x => x.pickupId === req.params.pickupId);
  if (idx === -1) return res.status(404).json({ error: 'Pickup not found' });
  const [removed] = list.splice(idx, 1);
  writeJsonFile(materialsFilePath, list);
  res.json({ success: true, removed });
});

module.exports = router;


