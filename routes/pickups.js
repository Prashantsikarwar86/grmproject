const express = require('express');
const { 
  createPickup, 
  getAllPickups, 
  getPickupById, 
  updatePickup, 
  deletePickup 
} = require('../utils/lotPickupHelpers');

const router = express.Router();

/**
 * POST /api/pickups
 * Create a new pickup with auto-generated lot and pickup IDs
 */
router.post('/', async (req, res) => {
  try {
    const { company_name, pickup_date, vehicle_number, driver_name, vehicle_charges, labour_charges, client_contact, status } = req.body;

    // Validate required fields
    if (!company_name || !pickup_date) {
      return res.status(400).json({ 
        error: 'company_name and pickup_date are required' 
      });
    }

    const pickupData = {
      company_name: company_name.trim(),
      pickup_date,
      vehicle_number: vehicle_number || null,
      driver_name: driver_name || null,
      vehicle_charges: Number(vehicle_charges || 0),
      labour_charges: Number(labour_charges || 0),
      client_contact: client_contact || null,
      status: status || 'pending'
    };

    const newPickup = await createPickup(pickupData);

    res.status(201).json({
      success: true,
      message: 'Pickup created successfully',
      data: newPickup
    });

  } catch (error) {
    console.error('Error creating pickup:', error);
    res.status(500).json({ 
      error: 'Failed to create pickup',
      details: error.message 
    });
  }
});

/**
 * GET /api/pickups
 * Get all pickups with their linked lot information
 */
router.get('/', async (req, res) => {
  try {
    const { company_name, lot_number, status, page = 1, pageSize = 20 } = req.query;
    
    let pickups = await getAllPickups();
    
    // Apply filters
    if (company_name) {
      pickups = pickups.filter(pickup => 
        pickup.company_name.toLowerCase().includes(company_name.toLowerCase())
      );
    }
    
    if (lot_number) {
      pickups = pickups.filter(pickup => 
        pickup.lot_number === lot_number
      );
    }
    
    if (status) {
      pickups = pickups.filter(pickup => 
        pickup.status === status
      );
    }
    
    // Sort by creation date (newest first)
    pickups.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Apply pagination
    const p = Math.max(1, parseInt(page));
    const ps = Math.max(1, parseInt(pageSize));
    const start = (p - 1) * ps;
    const paginatedPickups = pickups.slice(start, start + ps);
    
    res.json({
      success: true,
      data: paginatedPickups,
      pagination: {
        page: p,
        pageSize: ps,
        total: pickups.length,
        totalPages: Math.ceil(pickups.length / ps)
      }
    });

  } catch (error) {
    console.error('Error getting pickups:', error);
    res.status(500).json({ 
      error: 'Failed to get pickups',
      details: error.message 
    });
  }
});

/**
 * GET /api/pickups/:pickupId
 * Get a specific pickup by ID
 */
router.get('/:pickupId', async (req, res) => {
  try {
    const { pickupId } = req.params;
    
    const pickup = await getPickupById(pickupId);
    
    if (!pickup) {
      return res.status(404).json({ 
        error: 'Pickup not found' 
      });
    }
    
    res.json({
      success: true,
      data: pickup
    });

  } catch (error) {
    console.error('Error getting pickup:', error);
    res.status(500).json({ 
      error: 'Failed to get pickup',
      details: error.message 
    });
  }
});

/**
 * PUT /api/pickups/:pickupId
 * Update a pickup
 */
router.put('/:pickupId', async (req, res) => {
  try {
    const { pickupId } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.pickup_id;
    delete updateData.lot_number;
    delete updateData.company_name;
    delete updateData.created_at;
    
    const updatedPickup = await updatePickup(pickupId, updateData);
    
    if (!updatedPickup) {
      return res.status(404).json({ 
        error: 'Pickup not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Pickup updated successfully',
      data: updatedPickup
    });

  } catch (error) {
    console.error('Error updating pickup:', error);
    res.status(500).json({ 
      error: 'Failed to update pickup',
      details: error.message 
    });
  }
});

/**
 * DELETE /api/pickups/:pickupId
 * Delete a pickup
 */
router.delete('/:pickupId', async (req, res) => {
  try {
    const { pickupId } = req.params;
    
    const success = await deletePickup(pickupId);
    
    if (!success) {
      return res.status(404).json({ 
        error: 'Pickup not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Pickup deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting pickup:', error);
    res.status(500).json({ 
      error: 'Failed to delete pickup',
      details: error.message 
    });
  }
});

module.exports = router;
