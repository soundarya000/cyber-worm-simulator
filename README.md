# 🗂️ Cyber Worm Simulator

This project is an interactive simulation of a cyber worm infecting files in a directory tree. It visualizes how malware might spread, with options for "Teaching Mode" and "Smart Worm Mode" to demonstrate different infection strategies.

## Features

- **File Tree Visualization:** See a live map of files and folders, with infection status.
- **Worm Simulation:** Start, pause, and reset the infection process.
- **Teaching Mode:** Shows educational tips about file types and infection risks.
- **Smart Worm Mode:** Simulates a worm that skips large files, avoids detection, and prioritizes risky files.
- **Progress Bar & Trail Log:** Track infection progress and worm decisions.
- **Sound Effects:** Audio feedback on infection events.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Python 3.x

### Setup

1. **Install frontend dependencies:**
   ```sh
   npm install
   ```
2. **Start the flask backend:**
   cd backend
   pip install flask flask-cors
   python app.py
3. **Start the react frontend:**
   npm start

The React app runs on http://localhost:3000 and proxies API requests to the Flask backend at http://127.0.0.1:5000.

**Customizing the File Tree:**
The backend reads the directory structure from the sandbox/ folder. Add or remove files/folders there to change the simulation.

**File Infection Logic**
Files are "infected" in sequence, with the worm optionally skipping files based on size, type, or random stealth logic.
Teaching Mode provides real-time educational tips about the risks of each file type.

**Development**
Frontend: React (see src/App.js)
Backend: Flask (see backend/app.py)

**License**
This project is for educational and demonstration purposes only.
