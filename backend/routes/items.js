const express = require('express');
const { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem,
  addPracticeHistory,
  getPracticeHistory
} = require('../database');

const router = express.Router();

// Get all items
router.get('/', (req, res) => {
  try {
    const { type, search } = req.query;
    let items = getAllItems();
    
    if (type) {
      items = items.filter(item => item.type === type);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item => 
        item.content.toLowerCase().includes(searchLower) || 
        (item.translation && item.translation.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by created_at desc
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
router.get('/:id', (req, res) => {
  try {
    const item = getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item
router.post('/', (req, res) => {
  try {
    const { type, content, translation, image_path } = req.body;
    
    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content are required' });
    }
    
    const item = createItem({
      type,
      content,
      translation,
      image_path
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
router.put('/:id', (req, res) => {
  try {
    const { content, translation } = req.body;
    
    const item = updateItem(req.params.id, { content, translation });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
router.delete('/:id', (req, res) => {
  try {
    const success = deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item statistics
router.get('/:id/stats', (req, res) => {
  try {
    const history = getPracticeHistory(req.params.id);
    
    const avgScore = history.length > 0 
      ? history.reduce((sum, h) => sum + h.score, 0) / history.length 
      : 0;
    
    res.json({
      total_practices: history.length,
      average_score: avgScore,
      history: history.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
