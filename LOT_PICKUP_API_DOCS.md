# Lot and Pickup Management API Documentation

## Overview
This system provides automatic lot and pickup management for Deshwal Waste Management. Each company gets a unique lot number, and each pickup gets a unique pickup ID that's automatically generated.

## Key Features
- ✅ **Unique Lot Numbers** — one per company (never duplicates)
- ✅ **Unique Pickup IDs** — each pickup has its own ID
- ✅ **Auto-generation** — user can't create or edit manually
- ✅ **Material Integration** — materials linked to company, lot, and pickup
- ✅ **JSON-based Storage** — compatible with existing architecture

## API Endpoints

### Pickups

#### POST /api/pickups
Create a new pickup with auto-generated lot and pickup IDs.

**Request Body:**
```json
{
  "company_name": "ABC Electronics",
  "pickup_date": "2025-01-10",
  "vehicle_number": "UP80GT1234",
  "driver_name": "John Doe",
  "vehicle_charges": 1500,
  "labour_charges": 2000,
  "client_contact": "9876543210",
  "status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pickup created successfully",
  "data": {
    "id": "uuid-here",
    "pickup_id": "PICKUP-20250110-0001",
    "company_name": "ABC Electronics",
    "lot_number": "LOT-20250110-001",
    "pickup_date": "2025-01-10",
    "status": "pending",
    "vehicle_number": "UP80GT1234",
    "driver_name": "John Doe",
    "vehicle_charges": 1500,
    "labour_charges": 2000,
    "client_contact": "9876543210",
    "created_at": "2025-01-10T10:00:00.000Z",
    "updated_at": "2025-01-10T10:00:00.000Z"
  }
}
```

#### GET /api/pickups
Get all pickups with optional filtering.

**Query Parameters:**
- `company_name` (optional) - Filter by company name
- `lot_number` (optional) - Filter by lot number
- `status` (optional) - Filter by status
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "pickup_id": "PICKUP-20250110-0001",
      "company_name": "ABC Electronics",
      "lot_number": "LOT-20250110-001",
      "pickup_date": "2025-01-10",
      "status": "pending",
      "vehicle_number": "UP80GT1234",
      "driver_name": "John Doe",
      "vehicle_charges": 1500,
      "labour_charges": 2000,
      "client_contact": "9876543210",
      "created_at": "2025-01-10T10:00:00.000Z",
      "updated_at": "2025-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /api/pickups/:pickupId
Get a specific pickup by ID.

#### PUT /api/pickups/:pickupId
Update a pickup (lot_number and company_name cannot be changed).

#### DELETE /api/pickups/:pickupId
Delete a pickup.

### Lots

#### GET /api/lots
Get all lots with their companies.

**Query Parameters:**
- `company_name` (optional) - Filter by company name
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "lot_number": "LOT-20250110-001",
      "company_name": "ABC Electronics",
      "created_at": "2025-01-10T10:00:00.000Z",
      "updated_at": "2025-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /api/lots/:lotNumber
Get a specific lot by lot number.

### Materials (Enhanced)

#### GET /api/materials/headers
Get the complete schema of all material headers and fields.

**Response:**
```json
{
  "success": true,
  "message": "Material headers and fields schema",
  "schema": {
    "core": { "id": "string", "pickupId": "string", "company_name": "string", "lot_number": "string" },
    "client": { "clientName": "string", "clientContact": "string", "clientEmail": "string" },
    "materials": { "materialType": "string", "category": "string", "brand": "string" },
    // ... 15+ more categories with 60+ total fields
  },
  "totalFields": 65
}
```

#### GET /api/materials
Get all materials with enhanced filtering.

**Query Parameters:**
- `q` (optional) - Search term
- `company_name` (optional) - Filter by company name
- `lot_number` (optional) - Filter by lot number
- `status` (optional) - Filter by pickup status
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 20)

#### POST /api/materials
Create materials for a pickup with comprehensive headers. The pickup must exist first.

**Request Body:**
```json
{
  "pickupId": "PICKUP-20250110-0001",
  "materials": [
    {
      "materialType": "laptop",
      "category": "electronics",
      "subcategory": "computers",
      "brand": "Dell",
      "model": "Inspiron 15",
      "serialNumber": "DL123456",
      "description": "Used laptop in good condition",
      "specifications": "Intel i5, 8GB RAM, 256GB SSD",
      "quantity": 2,
      "weight": 2.5,
      "unitPrice": 5000,
      "dimensions": "35x25x2 cm",
      "color": "black",
      "condition": "good",
      "grade": "A",
      "quality": "excellent",
      "location": "Warehouse A",
      "warehouse": "Main Warehouse",
      "shelf": "A1",
      "bin": "B2",
      "status": "received",
      "priority": "normal",
      "assignedTo": "John Doe",
      "tags": ["electronics", "laptop", "recyclable"],
      "notes": "Good condition laptop",
      "hazardous": false,
      "recyclable": true,
      "vendor": "Tech Corp",
      "vendorContact": "vendor@tech.com",
      "costCenter": "IT001",
      "department": "IT",
      "projectCode": "PROJ001"
    }
  ],
  "clientEmail": "test@company.com",
  "clientAddress": "123 Main Street",
  "clientCity": "City",
  "clientState": "State",
  "clientZipCode": "12345",
  "clientCountry": "India",
  "driverLicense": "DL123456789",
  "driverContact": "9876543210",
  "paymentStatus": "pending",
  "paymentMethod": "cash",
  "invoiceNumber": "INV001",
  "pickupLocation": "Client Office",
  "deliveryLocation": "Warehouse",
  "warehouseLocation": "Main Warehouse",
  "processingStatus": "pending",
  "priority": "high",
  "assignedTo": "John Doe",
  "department": "Operations",
  "safetyCheck": true,
  "complianceStatus": "approved",
  "hazardousMaterials": false,
  "environmentalImpact": "low",
  "recyclingPotential": "high",
  "disposalMethod": "recycle",
  "qualityCheck": true,
  "qualityGrade": "A",
  "inspectionNotes": "Passed all quality checks",
  "documents": ["invoice.pdf", "warranty.pdf"],
  "images": ["laptop1.jpg", "laptop2.jpg"],
  "certificates": ["quality_cert.pdf"],
  "customFields": {
    "internalCode": "INT001",
    "specialInstructions": "Handle with care"
  }
}
```

**Note:** The `name` field has been removed from materials as per requirements. Materials are automatically linked to the pickup's company, lot, and pickup ID. All 65+ fields are supported.

## ID Generation Logic

### Lot Numbers
- Format: `LOT-YYYYMMDD-XXX`
- Example: `LOT-20250110-001`
- Incremental numbering per day
- One lot per company (reused for subsequent pickups)

### Pickup IDs
- Format: `PICKUP-YYYYMMDD-XXXX`
- Example: `PICKUP-20250110-0001`
- Incremental numbering per day
- Unique for each pickup

## Workflow

1. **Create Pickup**: POST to `/api/pickups` with company name
   - System automatically generates pickup ID
   - System finds existing lot or creates new one for the company
   - Pickup is linked to the lot

2. **Add Materials**: POST to `/api/materials` with pickup ID
   - Materials are automatically linked to company, lot, and pickup
   - Material name field is removed
   - Company/lot/pickup info is added automatically

3. **View Data**: Use GET endpoints to retrieve lots, pickups, and materials

## Example Usage

```javascript
// 1. Create pickup for ABC Electronics
const pickup1 = await fetch('/api/pickups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: 'ABC Electronics',
    pickup_date: '2025-01-10',
    vehicle_number: 'UP80GT1234',
    driver_name: 'John Doe',
    vehicle_charges: 1500,
    labour_charges: 2000,
    client_contact: '9876543210'
  })
});

// 2. Create another pickup for same company (uses existing lot)
const pickup2 = await fetch('/api/pickups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: 'ABC Electronics', // Same company
    pickup_date: '2025-01-11',
    vehicle_number: 'UP80GT5678',
    driver_name: 'Jane Smith',
    vehicle_charges: 1200,
    labour_charges: 1800,
    client_contact: '9876543210'
  })
});

// 3. Add materials to first pickup
const materials = await fetch('/api/materials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pickupId: 'PICKUP-20250110-0001',
    materials: [
      {
        materialType: 'laptop',
        quantity: 10,
        weight: 50,
        unitPrice: 5000,
        condition: 'good'
      }
    ]
  })
});
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a `message` field with details.
