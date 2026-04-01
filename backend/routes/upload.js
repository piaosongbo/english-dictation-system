const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Upload image
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Mock OCR result for now
    // In production, integrate with Tesseract.js or OCR API
    const mockOCRResults = [
      'Hello world',
      'Practice makes perfect',
      'The quick brown fox jumps over the lazy dog',
      'Education is the key to success',
      'Learning never exhausts the mind'
    ];
    
    const randomText = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      ocrText: randomText,
      message: 'Image uploaded successfully. OCR processing simulated.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock OCR endpoint (for testing without upload)
router.post('/ocr', (req, res) => {
  const { imageUrl } = req.body;
  
  // Mock OCR processing
  const mockOCRResults = [
    'Hello world',
    'Practice makes perfect',
    'The quick brown fox jumps over the lazy dog',
    'Education is the key to success',
    'Learning never exhausts the mind'
  ];
  
  const randomText = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
  
  setTimeout(() => {
    res.json({
      success: true,
      text: randomText,
      confidence: 0.85 + Math.random() * 0.1
    });
  }, 1000);
});

module.exports = router;
