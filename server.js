// server.js - Express.js Inventory Management REST API
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'inventory.json');

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Authentication middleware (example - check for API key)
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Simple API key check (you can change this)
  if (!apiKey || apiKey !== 'inventory-secret-key-2024') {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
};

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    items: [],
    categories: [],
    suppliers: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  console.log('✅ Created inventory.json file');
}

// Helper functions
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { items: [], categories: [], suppliers: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// ============= ITEMS ROUTES =============

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// GET /api/items/:id - Get item by ID
app.get('/api/items/:id', (req, res) => {
  const data = readData();
  const item = data.items.find(i => i.id === parseInt(req.params.id));
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// GET /api/items/category/:category - Get items by category
app.get('/api/items/category/:category', (req, res) => {
  const data = readData();
  const items = data.items.filter(i => i.category === req.params.category);
  res.json(items);
});

// GET /api/items/status/:status - Get items by status (in-stock/low-stock/out-of-stock)
app.get('/api/items/status/:status', (req, res) => {
  const data = readData();
  let items = [];
  
  switch(req.params.status) {
    case 'in-stock':
      items = data.items.filter(i => i.quantity > 10);
      break;
    case 'low-stock':
      items = data.items.filter(i => i.quantity > 0 && i.quantity <= 10);
      break;
    case 'out-of-stock':
      items = data.items.filter(i => i.quantity === 0);
      break;
    default:
      return res.status(400).json({ error: 'Invalid status. Use: in-stock, low-stock, out-of-stock' });
  }
  res.json(items);
});

// POST /api/items - Create new item (protected route)
app.post('/api/items', authenticateAPIKey, (req, res) => {
  const { name, description, price, quantity, category, supplierId } = req.body;
  
  // Validation
  if (!name || !price === undefined || !category) {
    return res.status(400).json({ 
      error: 'Missing required fields. Required: name, price, category' 
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  
  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
    return res.status(400).json({ error: 'Quantity must be a non-negative number' });
  }
  
  const data = readData();
  
  // Check if supplier exists
  if (supplierId) {
    const supplierExists = data.suppliers.find(s => s.id === supplierId);
    if (!supplierExists) {
      return res.status(400).json({ error: 'Supplier not found' });
    }
  }
  
  const newItem = {
    id: Date.now(),
    name,
    description: description || '',
    price,
    quantity: quantity || 0,
    category,
    supplierId: supplierId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.items.push(newItem);
  writeData(data);
  
  res.status(201).json({ message: 'Item created successfully', item: newItem });
});

// PUT /api/items/:id - Update entire item
app.put('/api/items/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const itemIndex = data.items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const { name, description, price, quantity, category, supplierId } = req.body;
  
  // Validation
  if (!name || !price === undefined || !category) {
    return res.status(400).json({ 
      error: 'Missing required fields. Required: name, price, category' 
    });
  }
  
  const updatedItem = {
    ...data.items[itemIndex],
    name,
    description: description || '',
    price,
    quantity: quantity || 0,
    category,
    supplierId: supplierId || null,
    updatedAt: new Date().toISOString()
  };
  
  data.items[itemIndex] = updatedItem;
  writeData(data);
  
  res.json({ message: 'Item updated successfully', item: updatedItem });
});

// PATCH /api/items/:id - Partially update item
app.patch('/api/items/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const itemIndex = data.items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const allowedUpdates = ['name', 'description', 'price', 'quantity', 'category', 'supplierId'];
  const updates = req.body;
  const invalidUpdates = Object.keys(updates).filter(key => !allowedUpdates.includes(key));
  
  if (invalidUpdates.length > 0) {
    return res.status(400).json({ error: `Invalid updates: ${invalidUpdates.join(', ')}` });
  }
  
  // Update only provided fields
  data.items[itemIndex] = {
    ...data.items[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  writeData(data);
  
  res.json({ message: 'Item updated successfully', item: data.items[itemIndex] });
});

// DELETE /api/items/:id - Delete item
app.delete('/api/items/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const itemIndex = data.items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = data.items.splice(itemIndex, 1)[0];
  writeData(data);
  
  res.json({ message: 'Item deleted successfully', item: deletedItem });
});

// PATCH /api/items/:id/stock - Update stock quantity
app.patch('/api/items/:id/stock', authenticateAPIKey, (req, res) => {
  const { quantity, operation } = req.body;
  const data = readData();
  const itemIndex = data.items.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  if (quantity === undefined || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Quantity is required and must be a number' });
  }
  
  let newQuantity = data.items[itemIndex].quantity;
  
  if (operation === 'add') {
    newQuantity += quantity;
  } else if (operation === 'subtract') {
    if (newQuantity - quantity < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    newQuantity -= quantity;
  } else {
    newQuantity = quantity;
  }
  
  data.items[itemIndex].quantity = newQuantity;
  data.items[itemIndex].updatedAt = new Date().toISOString();
  writeData(data);
  
  res.json({ 
    message: 'Stock updated successfully', 
    item: data.items[itemIndex],
    status: newQuantity === 0 ? 'out-of-stock' : newQuantity <= 10 ? 'low-stock' : 'in-stock'
  });
});

// ============= CATEGORIES ROUTES =============

// GET /api/categories - Get all categories
app.get('/api/categories', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// POST /api/categories - Create new category
app.post('/api/categories', authenticateAPIKey, (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  const data = readData();
  
  // Check if category already exists
  if (data.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ error: 'Category already exists' });
  }
  
  const newCategory = {
    id: Date.now(),
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  data.categories.push(newCategory);
  writeData(data);
  
  res.status(201).json({ message: 'Category created successfully', category: newCategory });
});

// DELETE /api/categories/:id - Delete category
app.delete('/api/categories/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const categoryIndex = data.categories.findIndex(c => c.id === parseInt(req.params.id));
  
  if (categoryIndex === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  // Check if any items use this category
  const itemsUsingCategory = data.items.filter(i => i.category === data.categories[categoryIndex].name);
  if (itemsUsingCategory.length > 0) {
    return res.status(400).json({ 
      error: `Cannot delete category. ${itemsUsingCategory.length} item(s) are using this category.` 
    });
  }
  
  const deletedCategory = data.categories.splice(categoryIndex, 1)[0];
  writeData(data);
  
  res.json({ message: 'Category deleted successfully', category: deletedCategory });
});

// ============= SUPPLIERS ROUTES =============

// GET /api/suppliers - Get all suppliers
app.get('/api/suppliers', (req, res) => {
  const data = readData();
  res.json(data.suppliers);
});

// GET /api/suppliers/:id - Get supplier by ID
app.get('/api/suppliers/:id', (req, res) => {
  const data = readData();
  const supplier = data.suppliers.find(s => s.id === parseInt(req.params.id));
  
  if (!supplier) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  res.json(supplier);
});

// POST /api/suppliers - Create new supplier
app.post('/api/suppliers', authenticateAPIKey, (req, res) => {
  const { name, contactPerson, email, phone, address } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const data = readData();
  
  const newSupplier = {
    id: Date.now(),
    name,
    contactPerson: contactPerson || '',
    email,
    phone: phone || '',
    address: address || '',
    createdAt: new Date().toISOString()
  };
  
  data.suppliers.push(newSupplier);
  writeData(data);
  
  res.status(201).json({ message: 'Supplier created successfully', supplier: newSupplier });
});

// PUT /api/suppliers/:id - Update supplier
app.put('/api/suppliers/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const supplierIndex = data.suppliers.findIndex(s => s.id === parseInt(req.params.id));
  
  if (supplierIndex === -1) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  
  const { name, contactPerson, email, phone, address } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const updatedSupplier = {
    ...data.suppliers[supplierIndex],
    name,
    contactPerson: contactPerson || '',
    email,
    phone: phone || '',
    address: address || '',
    updatedAt: new Date().toISOString()
  };
  
  data.suppliers[supplierIndex] = updatedSupplier;
  writeData(data);
  
  res.json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
});

// DELETE /api/suppliers/:id - Delete supplier
app.delete('/api/suppliers/:id', authenticateAPIKey, (req, res) => {
  const data = readData();
  const supplierIndex = data.suppliers.findIndex(s => s.id === parseInt(req.params.id));
  
  if (supplierIndex === -1) {
    return res.status(404).json({ error: 'Supplier not found' });
  }
  
  // Check if any items use this supplier
  const itemsUsingSupplier = data.items.filter(i => i.supplierId === parseInt(req.params.id));
  if (itemsUsingSupplier.length > 0) {
    return res.status(400).json({ 
      error: `Cannot delete supplier. ${itemsUsingSupplier.length} item(s) are associated with this supplier.` 
    });
  }
  
  const deletedSupplier = data.suppliers.splice(supplierIndex, 1)[0];
  writeData(data);
  
  res.json({ message: 'Supplier deleted successfully', supplier: deletedSupplier });
});

// ============= DASHBOARD/REPORT ROUTES =============

// GET /api/dashboard/summary - Get inventory summary
app.get('/api/dashboard/summary', (req, res) => {
  const data = readData();
  
  const totalItems = data.items.length;
  const totalValue = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockItems = data.items.filter(i => i.quantity > 0 && i.quantity <= 10).length;
  const outOfStockItems = data.items.filter(i => i.quantity === 0).length;
  const categoriesCount = data.categories.length;
  const suppliersCount = data.suppliers.length;
  
  res.json({
    summary: {
      totalItems,
      totalInventoryValue: totalValue.toFixed(2),
      lowStockItems,
      outOfStockItems,
      categoriesCount,
      suppliersCount
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/dashboard/category-stats - Get category-wise statistics
app.get('/api/dashboard/category-stats', (req, res) => {
  const data = readData();
  
  const categoryStats = data.categories.map(category => {
    const itemsInCategory = data.items.filter(i => i.category === category.name);
    const totalValue = itemsInCategory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      category: category.name,
      itemCount: itemsInCategory.length,
      totalValue: totalValue.toFixed(2),
      lowStockCount: itemsInCategory.filter(i => i.quantity > 0 && i.quantity <= 10).length,
      outOfStockCount: itemsInCategory.filter(i => i.quantity === 0).length
    };
  });
  
  res.json(categoryStats);
});

// Apply error handling middleware (should be last)
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║     📦 Express.js Inventory Management REST API Started      ║
╠══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                  ║
╠══════════════════════════════════════════════════════════════╣
║  ITEMS ENDPOINTS:                                            ║
║  • GET    /api/items                    - Get all items     ║
║  • GET    /api/items/:id                - Get item by ID    ║
║  • GET    /api/items/category/:category - Get items by cat  ║
║  • GET    /api/items/status/:status     - Get by stock      ║
║  • POST   /api/items                    - Create item       ║
║  • PUT    /api/items/:id                - Update item       ║
║  • PATCH  /api/items/:id                - Partial update    ║
║  • PATCH  /api/items/:id/stock          - Update stock      ║
║  • DELETE /api/items/:id                - Delete item       ║
╠══════════════════════════════════════════════════════════════╣
║  CATEGORIES ENDPOINTS:                                       ║
║  • GET    /api/categories               - Get categories    ║
║  • POST   /api/categories               - Create category   ║
║  • DELETE /api/categories/:id           - Delete category   ║
╠══════════════════════════════════════════════════════════════╣
║  SUPPLIERS ENDPOINTS:                                        ║
║  • GET    /api/suppliers                - Get suppliers     ║
║  • GET    /api/suppliers/:id            - Get supplier      ║
║  • POST   /api/suppliers                - Create supplier   ║
║  • PUT    /api/suppliers/:id            - Update supplier   ║
║  • DELETE /api/suppliers/:id            - Delete supplier   ║
╠══════════════════════════════════════════════════════════════╣
║  DASHBOARD ENDPOINTS:                                        ║
║  • GET    /api/dashboard/summary        - Get summary       ║
║  • GET    /api/dashboard/category-stats - Category stats    ║
╠══════════════════════════════════════════════════════════════╣
║  AUTHENTICATION:                                             ║
║  • Header: x-api-key: inventory-secret-key-2024             ║
╚══════════════════════════════════════════════════════════════╝
  `);
});