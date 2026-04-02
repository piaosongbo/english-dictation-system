// Simple in-memory database for demo
// In production, replace with proper SQLite or other database

const items = [];
const practiceHistory = [];
const settings = {
  daily_review_count: '10',
  theme: 'light',
  language: 'en'
};

function initDatabase() {
  console.log('In-memory database initialized');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Items CRUD
function createItem(item) {
  const newItem = {
    id: generateId(),
    ...item,
    created_at: new Date().toISOString(),
    next_review: new Date().toISOString(),
    review_count: 0,
    level: 0,
    ease_factor: 2.5,
    interval_days: 0
  };
  items.push(newItem);
  return newItem;
}

function getAllItems() {
  return items;
}

function getItemById(id) {
  return items.find(item => item.id === id);
}

function updateItem(id, updates) {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    return items[index];
  }
  return null;
}

function deleteItem(id) {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    return true;
  }
  return false;
}

// Practice history
function addPracticeHistory(record) {
  practiceHistory.push({
    id: generateId(),
    ...record,
    practiced_at: new Date().toISOString()
  });
}

function getPracticeHistory(itemId) {
  if (itemId) {
    return practiceHistory.filter(h => h.item_id === itemId);
  }
  return practiceHistory;
}

// Settings
function getSetting(key) {
  return settings[key];
}

function setSetting(key, value) {
  settings[key] = value;
}

function getAllSettings() {
  return { ...settings };
}

// Get items due for review
function getDueItems(limit = 10) {
  const now = new Date().toISOString();
  return items
    .filter(item => item.next_review <= now)
    .sort((a, b) => new Date(a.next_review) - new Date(b.next_review))
    .slice(0, limit);
}

module.exports = {
  initDatabase,
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  addPracticeHistory,
  getPracticeHistory,
  getSetting,
  setSetting,
  getAllSettings,
  getDueItems
};
