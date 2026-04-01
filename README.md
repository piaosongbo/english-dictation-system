# English Dictation Practice System

An English word and sentence recording & dictation practice system with OCR, handwriting practice, and spaced repetition.

## Features

- 📸 **Image Upload & OCR** - Upload images of English words/sentences and extract text
- ✍️ **Handwriting Practice** - Four-line-three-grid template for writing practice
- 🧠 **Spaced Repetition** - Ebbinghaus forgetting curve algorithm for daily review
- 📝 **Handwriting Recognition** - Recognize handwritten text and score accuracy

## Tech Stack

- **Frontend**: Vue 3 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **OCR**: Tesseract.js (client-side) / Mock API
- **Handwriting**: Canvas API

## Quick Start

### Install Dependencies

```bash
npm run install:all
```

### Start Development Server

Open two terminals and run:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```

Or use the following commands directly:

```bash
# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev
```

### Access the App

Open your browser and navigate to: http://localhost:5173

## Pages

1. **Home/Dashboard** - Overview and daily tasks
2. **Upload** - Image upload and OCR
3. **Practice** - Handwriting practice with four-line-three-grid
4. **Review** - Daily review based on Ebbinghaus curve
5. **Word Bank** - Manage all words/sentences
6. **Settings** - Configure daily count, etc.

## Project Structure

```
english-dictation-system/
├── frontend/          # Vue 3 frontend
│   ├── src/
│   │   ├── views/     # Page components
│   │   ├── stores/    # Pinia stores
│   │   ├── services/  # API services
│   │   └── ...
│   └── ...
├── backend/           # Node.js backend
│   ├── routes/        # API routes
│   ├── uploads/       # Uploaded images
│   └── ...
└── README.md
```

## Spaced Repetition Algorithm

The system uses the Ebbinghaus forgetting curve with review intervals:
- Level 1: 1 day
- Level 2: 2 days
- Level 3: 4 days
- Level 4: 7 days
- Level 5: 15 days
- Level 6: 30 days

## Scoring System

- 🌟 **Excellent (4)** - Perfect form, advance to next level
- 👍 **Good (3)** - Minor issues, advance to next level
- ✓ **Pass (2)** - Acceptable, maintain current level
- ✗ **Needs Work (1)** - Needs improvement, reset to level 1

## License

MIT
