const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../database');

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let sql = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (search) {
      sql += ' AND (content LIKE ? OR translation LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const items = await all(sql, params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item
router.post('/', async (req, res) => {
  try {
    const { type, content, translation, image_path } = req.body;
    const id = uuidv4();
    
    await run(
      `INSERT INTO items (id, type, content, translation, image_path, next_review) 
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [id, type, content, translation, image_path]
    );
    
    const item = await get('SELECT * FROM items WHERE id = ?', [id]);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { content, translation } = req.body;
    
    await run(
      'UPDATE items SET content = ?, translation = ? WHERE id = ?',
      [content, translation, req.params.id]
    );
    
    const item = await get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await run('DELETE FROM practice_history WHERE item_id = ?', [req.params.id]);
    await run('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const history = await all(
      'SELECT * FROM practice_history WHERE item_id = ? ORDER BY practiced_at DESC',
      [req.params.id]
    );
    
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
