const express = require('express');
const { run, get, all } = require('../database');

const router = express.Router();

// Ebbinghaus intervals: 1, 2, 4, 7, 15, 30 days
const INTERVALS = [1, 2, 4, 7, 15, 30];

// Get today's review items
router.get('/today', async (req, res) => {
  try {
    const settings = await get("SELECT value FROM settings WHERE key = 'daily_review_count'");
    const dailyLimit = parseInt(settings?.value || '10');
    
    const items = await all(
      `SELECT * FROM items 
       WHERE next_review <= datetime('now') 
       ORDER BY next_review ASC 
       LIMIT ?`,
      [dailyLimit]
    );
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get review count
router.get('/count', async (req, res) => {
  try {
    const result = await get(
      `SELECT COUNT(*) as count FROM items WHERE next_review <= datetime('now')`
    );
    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit practice result
router.post('/:id/practice', async (req, res) => {
  try {
    const { score, accuracy } = req.body;
    const itemId = req.params.id;
    
    // Record practice history
    await run(
      `INSERT INTO practice_history (item_id, score, accuracy) VALUES (?, ?, ?)`,
      [itemId, score, accuracy]
    );
    
    // Get current item state
    const item = await get('SELECT * FROM items WHERE id = ?', [itemId]);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Calculate next review using Ebbinghaus-inspired algorithm
    let newLevel = item.level;
    let newInterval = item.interval_days;
    let newEaseFactor = item.ease_factor;
    
    // Score levels: 4=Excellent, 3=Good, 2=Pass, 1=Needs Work
    if (score >= 3) {
      // Good performance - increase level and interval
      newLevel = Math.min(newLevel + 1, INTERVALS.length - 1);
      newInterval = INTERVALS[newLevel];
      newEaseFactor = Math.min(newEaseFactor + 0.1, 3.0);
    } else if (score === 2) {
      // Pass - maintain level
      newInterval = INTERVALS[newLevel];
    } else {
      // Needs work - reset to beginning
      newLevel = 0;
      newInterval = INTERVALS[0];
      newEaseFactor = Math.max(newEaseFactor - 0.2, 1.3);
    }
    
    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);
    
    // Update item
    await run(
      `UPDATE items SET 
        next_review = ?,
        review_count = review_count + 1,
        level = ?,
        ease_factor = ?,
        interval_days = ?
       WHERE id = ?`,
      [nextReview.toISOString(), newLevel, newEaseFactor, newInterval, itemId]
    );
    
    res.json({
      message: 'Practice recorded',
      next_review: nextReview.toISOString(),
      level: newLevel,
      interval_days: newInterval
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get practice history
router.get('/history', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const history = await all(
      `SELECT 
        date(practiced_at) as date,
        COUNT(*) as count,
        AVG(score) as avg_score
       FROM practice_history 
       WHERE practiced_at >= datetime('now', '-${days} days')
       GROUP BY date(practiced_at)
       ORDER BY date DESC`
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
