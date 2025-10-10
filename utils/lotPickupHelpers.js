const { readJsonFile, writeJsonFile, ensureDirectory } = require('./storage');
const path = require('path');

// Ensure data directories exist
const dataDir = path.join(__dirname, '..', 'data');
const lotsDir = path.join(dataDir, 'lots');
const pickupsDir = path.join(dataDir, 'pickups');

ensureDirectory(lotsDir);
ensureDirectory(pickupsDir);

const lotsFilePath = path.join(lotsDir, 'lots.json');
const pickupsFilePath = path.join(pickupsDir, 'pickups.json');

// Initialize files if they don't exist
if (!readJsonFile(lotsFilePath)) {
  writeJsonFile(lotsFilePath, []);
}
if (!readJsonFile(pickupsFilePath)) {
  writeJsonFile(pickupsFilePath, []);
}

/**
 * Generate a unique lot number
 * Format: LOT-YYYYMMDD-XXX
 * @returns {Promise<string>} Generated lot number
 */
const generateLotNumber = async () => {
  try {
    const lots = readJsonFile(lotsFilePath) || [];
    const lastLot = lots.length > 0 ? lots[lots.length - 1] : null;
    
    let lastNum = 0;
    if (lastLot && lastLot.lot_number) {
      const parts = lastLot.lot_number.split('-');
      if (parts.length === 3) {
        lastNum = parseInt(parts[2]) || 0;
      }
    }
    
    const nextNum = String(lastNum + 1).padStart(3, '0');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `LOT-${date}-${nextNum}`;
  } catch (error) {
    console.error('Error generating lot number:', error);
    // Fallback to timestamp-based generation
    const timestamp = Date.now().toString().slice(-6);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `LOT-${date}-${timestamp}`;
  }
};

/**
 * Generate a unique pickup ID
 * Format: PICKUP-YYYYMMDD-XXXX
 * @returns {Promise<string>} Generated pickup ID
 */
const generatePickupId = async () => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    const lastPickup = pickups.length > 0 ? pickups[pickups.length - 1] : null;
    
    let lastNum = 0;
    if (lastPickup && lastPickup.pickup_id) {
      const parts = lastPickup.pickup_id.split('-');
      if (parts.length === 3) {
        lastNum = parseInt(parts[2]) || 0;
      }
    }
    
    const nextNum = String(lastNum + 1).padStart(4, '0');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `PICKUP-${date}-${nextNum}`;
  } catch (error) {
    console.error('Error generating pickup ID:', error);
    // Fallback to timestamp-based generation
    const timestamp = Date.now().toString().slice(-4);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `PICKUP-${date}-${timestamp}`;
  }
};

/**
 * Find or create a lot for a company
 * @param {string} companyName - Name of the company
 * @returns {Promise<Object>} Lot object
 */
const findOrCreateLot = async (companyName) => {
  try {
    const lots = readJsonFile(lotsFilePath) || [];
    
    // Check if company already has a lot
    const existingLot = lots.find(lot => 
      lot.company_name && lot.company_name.toLowerCase() === companyName.toLowerCase()
    );
    
    if (existingLot) {
      return existingLot;
    }
    
    // Create new lot for the company
    const lotNumber = await generateLotNumber();
    const newLot = {
      id: require('uuid').v4(),
      lot_number: lotNumber,
      company_name: companyName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    lots.push(newLot);
    writeJsonFile(lotsFilePath, lots);
    
    return newLot;
  } catch (error) {
    console.error('Error finding or creating lot:', error);
    throw error;
  }
};

/**
 * Create a new pickup with auto-generated IDs
 * @param {Object} pickupData - Pickup data
 * @returns {Promise<Object>} Created pickup object
 */
const createPickup = async (pickupData) => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    
    // Generate pickup ID
    const pickupId = await generatePickupId();
    
    // Find or create lot for the company
    const lot = await findOrCreateLot(pickupData.company_name);
    
    const newPickup = {
      id: require('uuid').v4(),
      pickup_id: pickupId,
      company_name: pickupData.company_name,
      lot_number: lot.lot_number,
      pickup_date: pickupData.pickup_date,
      status: pickupData.status || 'pending',
      vehicle_number: pickupData.vehicle_number || null,
      driver_name: pickupData.driver_name || null,
      vehicle_charges: Number(pickupData.vehicle_charges || 0),
      labour_charges: Number(pickupData.labour_charges || 0),
      client_contact: pickupData.client_contact || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    pickups.push(newPickup);
    writeJsonFile(pickupsFilePath, pickups);
    
    return newPickup;
  } catch (error) {
    console.error('Error creating pickup:', error);
    throw error;
  }
};

/**
 * Get all lots with their companies
 * @returns {Promise<Array>} Array of lots
 */
const getAllLots = async () => {
  try {
    const lots = readJsonFile(lotsFilePath) || [];
    return lots;
  } catch (error) {
    console.error('Error getting all lots:', error);
    throw error;
  }
};

/**
 * Get all pickups with their linked lot information
 * @returns {Promise<Array>} Array of pickups
 */
const getAllPickups = async () => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    return pickups;
  } catch (error) {
    console.error('Error getting all pickups:', error);
    throw error;
  }
};

/**
 * Get pickup by ID
 * @param {string} pickupId - Pickup ID
 * @returns {Promise<Object|null>} Pickup object or null
 */
const getPickupById = async (pickupId) => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    return pickups.find(pickup => pickup.pickup_id === pickupId) || null;
  } catch (error) {
    console.error('Error getting pickup by ID:', error);
    throw error;
  }
};

/**
 * Update pickup
 * @param {string} pickupId - Pickup ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated pickup object or null
 */
const updatePickup = async (pickupId, updateData) => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    const pickupIndex = pickups.findIndex(pickup => pickup.pickup_id === pickupId);
    
    if (pickupIndex === -1) {
      return null;
    }
    
    const updatedPickup = {
      ...pickups[pickupIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    pickups[pickupIndex] = updatedPickup;
    writeJsonFile(pickupsFilePath, pickups);
    
    return updatedPickup;
  } catch (error) {
    console.error('Error updating pickup:', error);
    throw error;
  }
};

/**
 * Delete pickup
 * @param {string} pickupId - Pickup ID
 * @returns {Promise<boolean>} Success status
 */
const deletePickup = async (pickupId) => {
  try {
    const pickups = readJsonFile(pickupsFilePath) || [];
    const pickupIndex = pickups.findIndex(pickup => pickup.pickup_id === pickupId);
    
    if (pickupIndex === -1) {
      return false;
    }
    
    pickups.splice(pickupIndex, 1);
    writeJsonFile(pickupsFilePath, pickups);
    
    return true;
  } catch (error) {
    console.error('Error deleting pickup:', error);
    throw error;
  }
};

module.exports = {
  generateLotNumber,
  generatePickupId,
  findOrCreateLot,
  createPickup,
  getAllLots,
  getAllPickups,
  getPickupById,
  updatePickup,
  deletePickup
};
