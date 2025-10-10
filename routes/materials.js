const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJsonFile, writeJsonFile, ensureDirectory } = require('../utils/storage');
const { getPickupById } = require('../utils/lotPickupHelpers');

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
  const { q, page = 1, pageSize = 20, company_name, lot_number, status } = req.query;
  let filtered = list;
  
  // Apply filters
  if (q) {
    const term = String(q).toLowerCase();
    filtered = list.filter(x =>
      String(x.pickupId).toLowerCase().includes(term) ||
      String(x.clientName || '').toLowerCase().includes(term) ||
      String(x.company_name || '').toLowerCase().includes(term) ||
      String(x.lot_number || '').toLowerCase().includes(term)
    );
  }
  
  if (company_name) {
    filtered = filtered.filter(x => 
      x.company_name && x.company_name.toLowerCase().includes(company_name.toLowerCase())
    );
  }
  
  if (lot_number) {
    filtered = filtered.filter(x => x.lot_number === lot_number);
  }
  
  if (status) {
    filtered = filtered.filter(x => x.pickupStatus === status);
  }
  
  // Sort by creation date (newest first)
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const p = Math.max(1, parseInt(page));
  const ps = Math.max(1, parseInt(pageSize));
  const start = (p - 1) * ps;
  const items = filtered.slice(start, start + ps);
  
  res.json({ 
    success: true,
    items, 
    total: filtered.length, 
    page: p, 
    pageSize: ps,
    pagination: {
      page: p,
      pageSize: ps,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / ps)
    }
  });
});

// GET material headers and fields schema
router.get('/headers', (req, res) => {
  const materialHeaders = {
    core: {
      id: 'string',
      pickupId: 'string',
      company_name: 'string',
      lot_number: 'string',
      pickupDate: 'date',
      pickupStatus: 'string'
    },
    client: {
      clientName: 'string',
      clientContact: 'string',
      clientEmail: 'string',
      clientAddress: 'string',
      clientCity: 'string',
      clientState: 'string',
      clientZipCode: 'string',
      clientCountry: 'string'
    },
    vehicle: {
      vehicleNumber: 'string',
      driverName: 'string',
      driverLicense: 'string',
      driverContact: 'string'
    },
    financial: {
      vehicleCharges: 'number',
      labourCharges: 'number',
      totalCharges: 'number',
      paymentStatus: 'string',
      paymentMethod: 'string',
      invoiceNumber: 'string'
    },
    location: {
      pickupLocation: 'string',
      deliveryLocation: 'string',
      warehouseLocation: 'string'
    },
    processing: {
      processingStatus: 'string',
      priority: 'string',
      assignedTo: 'string',
      department: 'string'
    },
    materials: {
      productId: 'string',
      materialType: 'string',
      category: 'string',
      subcategory: 'string',
      brand: 'string',
      model: 'string',
      serialNumber: 'string',
      description: 'string',
      specifications: 'string',
      quantity: 'number',
      weight: 'number',
      unitPrice: 'number',
      totalValue: 'number',
      dimensions: 'string',
      color: 'string',
      condition: 'string',
      grade: 'string',
      quality: 'string'
    },
    tracking: {
      location: 'string',
      warehouse: 'string',
      shelf: 'string',
      bin: 'string',
      status: 'string',
      priority: 'string',
      assignedTo: 'string'
    },
    compliance: {
      safetyCheck: 'boolean',
      complianceStatus: 'string',
      hazardousMaterials: 'boolean',
      hazardous: 'boolean',
      safetyNotes: 'string'
    },
    environmental: {
      environmentalImpact: 'string',
      recyclingPotential: 'string',
      disposalMethod: 'string',
      recyclable: 'boolean'
    },
    quality: {
      qualityCheck: 'boolean',
      qualityGrade: 'string',
      inspectionNotes: 'string'
    },
    documentation: {
      documents: 'array',
      images: 'array',
      certificates: 'array',
      tags: 'array',
      notes: 'string'
    },
    vendor: {
      vendor: 'string',
      vendorContact: 'string',
      purchaseOrder: 'string',
      invoiceNumber: 'string'
    },
    financial_tracking: {
      costCenter: 'string',
      department: 'string',
      projectCode: 'string'
    },
    timestamps: {
      createdAt: 'date',
      updatedAt: 'date',
      receivedDate: 'date',
      processedDate: 'date',
      processedAt: 'date',
      completedAt: 'date',
      lastUpdated: 'date'
    },
    custom: {
      customFields: 'object'
    }
  };
  
  res.json({
    success: true,
    message: 'Material headers and fields schema',
    schema: materialHeaders,
    totalFields: Object.values(materialHeaders).reduce((acc, category) => acc + Object.keys(category).length, 0)
  });
});

// GET by pickupId
router.get('/:pickupId', (req, res) => {
  const list = readJsonFile(materialsFilePath) || [];
  const item = list.find(x => x.pickupId === req.params.pickupId);
  if (!item) return res.status(404).json({ error: 'Pickup not found' });
  res.json(item);
});

// CREATE new pickup/materials
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const list = readJsonFile(materialsFilePath) || [];

    // Validate required fields
    if (!body.pickupId) {
      return res.status(400).json({ error: 'pickupId is required' });
    }

    // Verify pickup exists and get lot information
    const pickup = await getPickupById(body.pickupId);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    // Process materials - remove name field, add company/lot/pickup info
    const materials = Array.isArray(body.materials) ? body.materials.map(m => ({
      // Remove name field as per requirements
      name: undefined,
      // Add company, lot, and pickup information
      company_name: pickup.company_name,
      lot_number: pickup.lot_number,
      pickup_id: pickup.pickup_id,
      // Material-specific fields
      productId: m.productId || `P${Date.now()}`,
      materialType: m.materialType || '',
      category: m.category || '',
      subcategory: m.subcategory || '',
      brand: m.brand || '',
      model: m.model || '',
      serialNumber: m.serialNumber || '',
      description: m.description || '',
      specifications: m.specifications || '',
      // Quantity and pricing
      quantity: Number(m.quantity || 0),
      weight: Number(m.weight || 0),
      unitPrice: Number(m.unitPrice || 0),
      totalValue: Number(m.totalValue || (Number(m.quantity || 0) * Number(m.unitPrice || 0))),
      // Physical properties
      dimensions: m.dimensions || '',
      color: m.color || '',
      condition: m.condition || '',
      grade: m.grade || '',
      quality: m.quality || '',
      // Location and tracking
      location: m.location || '',
      warehouse: m.warehouse || '',
      shelf: m.shelf || '',
      bin: m.bin || '',
      // Status and workflow
      status: m.status || 'pending',
      priority: m.priority || 'normal',
      assignedTo: m.assignedTo || '',
      // Dates
      receivedDate: m.receivedDate || pickup.pickup_date,
      processedDate: m.processedDate || null,
      lastUpdated: new Date().toISOString(),
      // Additional metadata
      tags: m.tags || [],
      notes: m.notes || '',
      images: m.images || [],
      documents: m.documents || [],
      // Compliance and safety
      hazardous: m.hazardous || false,
      safetyNotes: m.safetyNotes || '',
      complianceStatus: m.complianceStatus || 'pending',
      // Financial tracking
      costCenter: m.costCenter || '',
      department: m.department || '',
      projectCode: m.projectCode || '',
      // Vendor information
      vendor: m.vendor || '',
      vendorContact: m.vendorContact || '',
      purchaseOrder: m.purchaseOrder || '',
      invoiceNumber: m.invoiceNumber || '',
      // Environmental data
      recyclable: m.recyclable || false,
      disposalMethod: m.disposalMethod || '',
      environmentalImpact: m.environmentalImpact || '',
      // Custom fields
      customFields: m.customFields || {}
    })) : [];

    const totals = calculateTotals(materials);

    const record = {
      id: uuidv4(),
      // Core identifiers
      pickupId: pickup.pickup_id,
      company_name: pickup.company_name,
      lot_number: pickup.lot_number,
      // Pickup information
      pickupDate: pickup.pickup_date,
      pickupStatus: pickup.status || 'pending',
      // Client information
      clientName: pickup.company_name,
      clientContact: pickup.client_contact || null,
      clientEmail: body.clientEmail || null,
      clientAddress: body.clientAddress || null,
      clientCity: body.clientCity || null,
      clientState: body.clientState || null,
      clientZipCode: body.clientZipCode || null,
      clientCountry: body.clientCountry || null,
      // Vehicle and driver information
      vehicleNumber: pickup.vehicle_number || null,
      driverName: pickup.driver_name || null,
      driverLicense: body.driverLicense || null,
      driverContact: body.driverContact || null,
      // Financial information
      vehicleCharges: pickup.vehicle_charges || 0,
      labourCharges: pickup.labour_charges || 0,
      totalCharges: (pickup.vehicle_charges || 0) + (pickup.labour_charges || 0),
      paymentStatus: body.paymentStatus || 'pending',
      paymentMethod: body.paymentMethod || null,
      invoiceNumber: body.invoiceNumber || null,
      // Location and logistics
      pickupLocation: body.pickupLocation || null,
      deliveryLocation: body.deliveryLocation || null,
      warehouseLocation: body.warehouseLocation || null,
      // Processing information
      processingStatus: body.processingStatus || 'pending',
      priority: body.priority || 'normal',
      assignedTo: body.assignedTo || null,
      department: body.department || null,
      // Materials and totals
      materials: normalizeProductIds(materials),
      totals,
      // Compliance and safety
      safetyCheck: body.safetyCheck || false,
      complianceStatus: body.complianceStatus || 'pending',
      hazardousMaterials: body.hazardousMaterials || false,
      // Environmental tracking
      environmentalImpact: body.environmentalImpact || null,
      recyclingPotential: body.recyclingPotential || null,
      disposalMethod: body.disposalMethod || null,
      // Quality control
      qualityCheck: body.qualityCheck || false,
      qualityGrade: body.qualityGrade || null,
      inspectionNotes: body.inspectionNotes || null,
      // Documentation
      documents: body.documents || [],
      images: body.images || [],
      certificates: body.certificates || [],
      // Custom fields
      customFields: body.customFields || {},
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      processedAt: null,
      completedAt: null
    };

    // Check if pickup already has materials
    if (list.some(x => x.pickupId === pickup.pickup_id)) {
      return res.status(400).json({ error: 'Materials for this pickup already exist' });
    }

    list.push(record);
    const ok = writeJsonFile(materialsFilePath, list);
    if (!ok) {
      console.error('Failed to write materials file');
      return res.status(500).json({ error: 'Failed to save materials on server' });
    }

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating materials:', error);
    res.status(500).json({ error: 'Failed to create materials', details: error.message });
  }
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


