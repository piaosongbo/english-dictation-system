const express = require('express');
const { 
  getDueItems,
  getAllItems,
  getItemById,
  updateItem,
  addPracticeHistory,
  getPracticeHistory,
  getSetting
} = require('../database');

const router = express.Router();

// Ebbinghaus intervals: 1, 2, 4, 7, 15, 30 days
const INTERVALS = [1, 2, 4, 7, 15, 30];

// Get today's review items
router.get('/today', (req, res) => {
  try {
    const dailyLimit = parseInt(getSetting('daily_review_count') || '10');
    const items = getDueItems(dailyLimit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get review count
router.get('/count', (req, res) => {
  try {
    const items = getDueItems();
    res.json({ count: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit practice result
router.post('/:id/practice', (req, res) => {
  try {
    const { score, accuracy } = req.body;
    const itemId = req.params.id;
    
    // Get current item state
    const item = getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Record practice history
    addPracticeHistory({
      item_id: itemId,
      score,
      accuracy
    });
    
    // Calculate next review using Ebbinghaus-inspired algorithm
    let newLevel = item.level || 0;
    let newInterval = item.interval_days || 0;
    let newEaseFactor = item.ease_factor || 2.5;
    
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
    updateItem(itemId, {
      next_review: nextReview.toISOString(),
      review_count: (item.review_count || 0) + 1,
      level: newLevel,
      ease_factor: newEaseFactor,
      interval_days: newInterval
    });
    
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
router.get('/history', (req, res) => {
  try {
    const { days = 7 } = req.query;
    const history = getPracticeHistory();
    
    // Filter by days and group by date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    const filtered = history.filter(h => new Date(h.practiced_at) >= cutoffDate);
    
    // Group by date
    const grouped = filtered.reduce((acc, h) => {
      const date = h.practiced_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0, totalScore: 0 };
      }
      acc[date].count++;
      acc[date].totalScore += h.score;
      return acc;
    }, {});
    
    const result = Object.values(grouped)
      .map(g => ({
        date: g.date,
        count: g.count,
        avg_score: g.totalScore / g.count
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
