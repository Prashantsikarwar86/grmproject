const express = require('express');
const path = require('path');
const { readJsonFile, ensureDirectory, writeJsonFile } = require('../utils/storage');
const PDFDocument = require('pdfkit');

const router = express.Router();

const materialsFilePath = path.join(__dirname, '..', 'data', 'materials', 'materials.json');
const reportsDir = path.join(__dirname, '..', 'data', 'reports');
const reportsIndexPath = path.join(reportsDir, 'reports.json');
ensureDirectory(reportsDir);
if (!readJsonFile(reportsIndexPath)) writeJsonFile(reportsIndexPath, []);

// List all reports
router.get('/', (req, res) => {
  const list = readJsonFile(reportsIndexPath) || [];
  res.json(list);
});

// Generate a simple GRM summary for a pickupId
router.post('/generate', (req, res) => {
  const { pickupId } = req.body || {};
  if (!pickupId) return res.status(400).json({ error: 'pickupId is required' });

  const materialsList = readJsonFile(materialsFilePath) || [];
  const pickup = materialsList.find(x => x.pickupId === pickupId);
  if (!pickup) return res.status(404).json({ error: 'Pickup not found' });

  const summary = {
    pickupId: pickup.pickupId,
    pickupDate: pickup.pickupDate,
    clientName: pickup.clientName,
    totals: pickup.totals,
    charges: {
      vehicleCharges: pickup.vehicleCharges,
      labourCharges: pickup.labourCharges
    },
    grandTotal: Number(pickup.totals.totalValue || 0) + Number(pickup.labourCharges || 0) + Number(pickup.vehicleCharges || 0)
  };

  const reports = readJsonFile(reportsIndexPath) || [];
  const record = {
    id: `${pickupId}-${Date.now()}`,
    pickupId,
    createdAt: new Date().toISOString(),
    summary
  };
  reports.push(record);
  writeJsonFile(reportsIndexPath, reports);

  res.status(201).json(record);
});

// Get report by id
router.get('/:id', (req, res) => {
  const list = readJsonFile(reportsIndexPath) || [];
  const item = list.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Report not found' });
  res.json(item);
});

// Export CSV for a report id
router.get('/:id/export.csv', (req, res) => {
  const list = readJsonFile(reportsIndexPath) || [];
  const item = list.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Report not found' });
  const headers = ['pickupId','totalProducts','totalWeight','totalValue','vehicleCharges','labourCharges','grandTotal'];
  const r = item.summary;
  const row = [r.pickupId, r.totals.totalProducts, r.totals.totalWeight, r.totals.totalValue, r.charges.vehicleCharges, r.charges.labourCharges, r.grandTotal];
  const csv = `${headers.join(',')}
${row.join(',')}`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="report_${item.id}.csv"`);
  res.send(csv);
});

module.exports = router;

// PDF export
router.get('/:id/export.pdf', (req, res) => {
  const list = readJsonFile(reportsIndexPath) || [];
  const item = list.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Report not found' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="report_${item.id}.pdf"`);
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(18).text('GRM Report', { underline: true });
  doc.moveDown();
  const s = item.summary;
  doc.fontSize(12).text(`Pickup ID: ${s.pickupId}`);
  doc.text(`Client: ${s.clientName || ''}`);
  doc.text(`Totals - Products: ${s.totals.totalProducts}, Weight: ${s.totals.totalWeight}, Value: ${s.totals.totalValue}`);
  doc.text(`Charges - Vehicle: ${s.charges.vehicleCharges}, Labour: ${s.charges.labourCharges}`);
  doc.text(`Grand Total: ${s.grandTotal}`);
  doc.end();
});


