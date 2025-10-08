// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    // Material Entry Form
    const materialEntryForm = document.getElementById('materialEntryForm');
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    const materialEntries = document.getElementById('materialEntries');
    
    // Initialize Charts
    initCharts();
    
    // Navigation Event Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link and target section
            this.parentElement.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Add Material Entry Event Listener
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            addNewMaterialEntry();
        });
    }
    
    // Calculate Total Value Event Listeners
    document.addEventListener('input', function(e) {
        if (e.target.id && e.target.id.startsWith('quantity') || e.target.id.startsWith('unitPrice')) {
            const idNumber = e.target.id.replace(/[^0-9]/g, '');
            calculateTotalValue(idNumber);
        }
    });
    
    // Form Submit Event Listener
    if (materialEntryForm) {
        materialEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveFormData();
        });
    }
    
    // Initialize Pickup ID and Product IDs
    initializeIds();
});

// Initialize Charts
function initCharts() {
    // Material Distribution Chart
    const materialCtx = document.getElementById('materialChart');
    if (materialCtx) {
        new Chart(materialCtx, {
            type: 'pie',
            data: {
                labels: ['Laptop', 'Desktop', 'Server', 'Charger', 'Monitor', 'Other'],
                datasets: [{
                    data: [30, 20, 15, 10, 15, 10],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#F44336',
                        '#9C27B0',
                        '#607D8B'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
    
    // Weekly Pickups Chart
    const pickupCtx = document.getElementById('pickupChart');
    if (pickupCtx) {
        new Chart(pickupCtx, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Number of Pickups',
                    data: [5, 7, 3, 8, 6, 2, 0],
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}

// Add New Material Entry
function addNewMaterialEntry() {
    const materialEntries = document.getElementById('materialEntries');
    const entryCount = materialEntries.children.length + 1;
    
    const newEntry = document.createElement('div');
    newEntry.className = 'material-entry';
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-field">
                <label for="productId${entryCount}">Product ID</label>
                <input type="text" id="productId${entryCount}" placeholder="Auto-generated" readonly>
            </div>
            <div class="form-field">
                <label for="materialType${entryCount}">Material Type</label>
                <select id="materialType${entryCount}" required>
                    <option value="">Select Material Type</option>
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop</option>
                    <option value="server">Server</option>
                    <option value="charger">Charger</option>
                    <option value="monitor">Monitor</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="mouse">Mouse</option>
                    <option value="other">Other</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-field">
                <label for="quantity${entryCount}">Quantity</label>
                <input type="number" id="quantity${entryCount}" min="1" required>
            </div>
            <div class="form-field">
                <label for="weight${entryCount}">Weight (kg)</label>
                <input type="number" id="weight${entryCount}" step="0.01" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-field">
                <label for="unitPrice${entryCount}">Unit Price (₹)</label>
                <input type="number" id="unitPrice${entryCount}" step="0.01" required>
            </div>
            <div class="form-field">
                <label for="totalValue${entryCount}">Total Value (₹)</label>
                <input type="number" id="totalValue${entryCount}" readonly>
            </div>
        </div>
        <div class="form-row">
            <div class="form-field full-width">
                <label for="condition${entryCount}">Condition/Quality</label>
                <select id="condition${entryCount}" required>
                    <option value="">Select Condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn" onclick="removeMaterialEntry(this)">Remove</button>
    `;
    
    materialEntries.appendChild(newEntry);
    
    // Set Product ID
    document.getElementById(`productId${entryCount}`).value = `P${entryCount}`;
}

// Remove Material Entry
function removeMaterialEntry(button) {
    const entry = button.parentElement;
    entry.parentElement.removeChild(entry);
    
    // Renumber remaining entries
    const materialEntries = document.getElementById('materialEntries');
    const entries = materialEntries.children;
    
    for (let i = 0; i < entries.length; i++) {
        const productIdInput = entries[i].querySelector('[id^="productId"]');
        productIdInput.value = `P${i + 1}`;
    }
}

// Calculate Total Value
function calculateTotalValue(idNumber) {
    const quantityInput = document.getElementById(`quantity${idNumber}`);
    const unitPriceInput = document.getElementById(`unitPrice${idNumber}`);
    const totalValueInput = document.getElementById(`totalValue${idNumber}`);
    
    if (quantityInput && unitPriceInput && totalValueInput) {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const totalValue = quantity * unitPrice;
        
        totalValueInput.value = totalValue.toFixed(2);
    }
}

// Initialize IDs
function initializeIds() {
    // Set Pickup ID
    const pickupIdInput = document.getElementById('pickupId');
    if (pickupIdInput) {
        // In a real application, this would be fetched from the server
        // For demo purposes, we'll generate a random ID
        const randomId = Math.floor(1000 + Math.random() * 9000);
        pickupIdInput.value = `PU${randomId}`;
    }
    
    // Set Product ID for first entry
    const productIdInput = document.getElementById('productId1');
    if (productIdInput) {
        productIdInput.value = 'P1';
    }
}

// Save Form Data
function saveFormData() {
    // Get form data
    const formData = {
        pickupId: document.getElementById('pickupId').value,
        pickupDate: document.getElementById('pickupDate').value,
        clientName: document.getElementById('clientName').value,
        clientContact: document.getElementById('clientContact').value,
        vehicleNumber: document.getElementById('vehicleNumber').value,
        driverName: document.getElementById('driverName').value,
        vehicleCharges: parseFloat(document.getElementById('vehicleCharges').value) || 0,
        labourCharges: parseFloat(document.getElementById('labourCharges').value) || 0,
        materials: []
    };
    
    // Get material entries
    const materialEntries = document.getElementById('materialEntries').children;
    for (let i = 0; i < materialEntries.length; i++) {
        const entry = materialEntries[i];
        const idNumber = i + 1;
        
        const material = {
            productId: document.getElementById(`productId${idNumber}`).value,
            materialType: document.getElementById(`materialType${idNumber}`).value,
            quantity: parseInt(document.getElementById(`quantity${idNumber}`).value) || 0,
            weight: parseFloat(document.getElementById(`weight${idNumber}`).value) || 0,
            unitPrice: parseFloat(document.getElementById(`unitPrice${idNumber}`).value) || 0,
            totalValue: parseFloat(document.getElementById(`totalValue${idNumber}`).value) || 0,
            condition: document.getElementById(`condition${idNumber}`).value
        };
        
        formData.materials.push(material);
    }
    
    // In a real application, this data would be sent to the server
    // For demo purposes, we'll log it to the console and show an alert
    console.log('Form Data:', formData);
    
    // Calculate completeness
    const completeness = calculateCompleteness(formData);
    
    // Show success message
    alert(`Data saved successfully!\nCompleteness: ${completeness}%`);
    
    // Generate GRM Report
    generateGRMReport(formData, completeness);
}

// Calculate Completeness
function calculateCompleteness(formData) {
    let totalFields = 8; // Base fields
    let filledFields = 0;
    
    // Check base fields
    if (formData.pickupId) filledFields++;
    if (formData.pickupDate) filledFields++;
    if (formData.clientName) filledFields++;
    if (formData.clientContact) filledFields++;
    if (formData.vehicleNumber) filledFields++;
    if (formData.driverName) filledFields++;
    if (formData.vehicleCharges) filledFields++;
    if (formData.labourCharges) filledFields++;
    
    // Check material fields
    formData.materials.forEach(material => {
        totalFields += 7; // Fields per material
        
        if (material.productId) filledFields++;
        if (material.materialType) filledFields++;
        if (material.quantity) filledFields++;
        if (material.weight) filledFields++;
        if (material.unitPrice) filledFields++;
        if (material.totalValue) filledFields++;
        if (material.condition) filledFields++;
    });
    
    // Calculate percentage
    return Math.round((filledFields / totalFields) * 100);
}

// Generate GRM Report
function generateGRMReport(formData, completeness) {
    // In a real application, this would generate a report and display it
    // For demo purposes, we'll navigate to the reports section
    
    // Switch to reports section
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    // Remove active class from all links and sections
    navLinks.forEach(link => link.parentElement.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));
    
    // Add active class to reports link and section
    document.querySelector('a[href="#reports"]').parentElement.classList.add('active');
    document.getElementById('reports').classList.add('active');
}

// File Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('fileUpload');
    
    if (uploadArea && fileInput) {
        // Click on upload area to trigger file input
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        // Handle file input change
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }
});

// Handle Files
function handleFiles(files) {
    // In a real application, these files would be uploaded to the server
    // For demo purposes, we'll log them to the console
    console.log('Files to upload:', files);
    
    // Show success message
    alert(`${files.length} file(s) selected for upload.`);
}