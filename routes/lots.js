const express = require('express');
const { getAllLots } = require('../utils/lotPickupHelpers');

const router = express.Router();

/**
 * GET /api/lots
 * Get all lots with their companies and associated pickups
 */
router.get('/', async (req, res) => {
  try {
    const { company_name, page = 1, pageSize = 20 } = req.query;
    
    let lots = await getAllLots();
    
    // Apply company filter if provided
    if (company_name) {
      lots = lots.filter(lot => 
        lot.company_name.toLowerCase().includes(company_name.toLowerCase())
      );
    }
    
    // Sort by creation date (newest first)
    lots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Apply pagination
    const p = Math.max(1, parseInt(page));
    const ps = Math.max(1, parseInt(pageSize));
    const start = (p - 1) * ps;
    const paginatedLots = lots.slice(start, start + ps);
    
    res.json({
      success: true,
      data: paginatedLots,
      pagination: {
        page: p,
        pageSize: ps,
        total: lots.length,
        totalPages: Math.ceil(lots.length / ps)
      }
    });

  } catch (error) {
    console.error('Error getting lots:', error);
    res.status(500).json({ 
      error: 'Failed to get lots',
      details: error.message 
    });
  }
});

/**
 * GET /api/lots/:lotNumber
 * Get a specific lot by lot number
 */
router.get('/:lotNumber', async (req, res) => {
  try {
    const { lotNumber } = req.params;
    
    const lots = await getAllLots();
    const lot = lots.find(l => l.lot_number === lotNumber);
    
    if (!lot) {
      return res.status(404).json({ 
        error: 'Lot not found' 
      });
    }
    
    res.json({
      success: true,
      data: lot
    });

  } catch (error) {
    console.error('Error getting lot:', error);
    res.status(500).json({ 
      error: 'Failed to get lot',
      details: error.message 
    });
  }
});

module.exports = router;
