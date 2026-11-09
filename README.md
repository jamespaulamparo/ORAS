# ORAS — University Student Timetable Planner

<div align="center">
  <img src="frontend/public/oras-logo.svg" alt="ORAS Logo" width="160" />
  <p><strong>Conflict-free university schedule planning made clean and deliberate.</strong></p>
  <p><em>"Time is what we want most, but what we use worst." — William Penn</em></p>
</div>

---

## What is ORAS?

**ORAS** (named after the Filipino word for *time* / *hour*) is a minimalist, typography-first timetable planner for university students. 

Students often struggle with confusing section offerings, overlapping prerequisites, or 4-hour dead campus gaps. ORAS provides a fast, zero-friction interface to visualize your semester, detect time conflicts instantly, and export a clean schedule for your phone lockscreen or binder.

### Key Highlights
- **Zero Friction & Anonymous by Default:** No registration or login required. Your classes persist automatically in your browser session.
- **Strict Half-Hour Increments:** Class times snap to `:00` and `:30` (e.g. `08:30 – 10:00`), preventing input typos and matching university scheduling periods.
- **Mathematical Half-Open Interval Validation:** Classes ending at 10:30 and starting at 10:30 do not trigger false conflicts. Overlaps are highlighted with exact diagnostic messages.
- **16 Ellipsus-Inspired Themes:** 8 rich Dark themes (Leatherbound, Red Velvet, Ultra Dark, Midnight, Graphite, Espresso, Evergreen, Sepia) and 8 Light themes (Paper, Maple, Pumpkin Spice, Valentine, Roseglow, Sage, Sandstone, Minimal). Themes dynamically recolor your course blocks to maintain perfect aesthetic harmony.
- **Enrolled Classes Summary Table:** Below the 2D timetable grid, a color-coded summary lists all subjects, section codes, unit counts, meeting times, and rooms.
- **Schedule-Only Export (PNG & PDF):** Export strictly your weekly timetable as a high-resolution PNG image or clean printable PDF without website navigation chrome.
- **Fully Responsive:** 100% width on mobile screens with zero awkward horizontal scrolling, plus a 1-click single-day inspector view.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Plus Jakarta Sans |
| **Backend** | Python 3.14, Django 5.x, Django REST Framework, SQLite / PostgreSQL |
| **Styling** | Semantic CSS Variables, 16 Ellipsus Themes, Custom Hex Color Picker |
| **Testing** | Django TestCase (`Ran 10 tests in 1.24s OK`) |

---

## Quick Start Guide for Windows (VS Code)

To run the application locally on Windows, open **two separate terminal tabs** in VS Code:
- **Terminal 1:** Django Backend (API & Database)
- **Terminal 2:** React + Vite Frontend (User Interface)

---

### Step 1: Open Your Workspace in VS Code

1. Open VS Code.
2. Go to **File > Open Folder...** and select the `ORAS` repository root.
3. Open a terminal by pressing `` Ctrl + ` `` (Backtick).

---

### Step 2: Start the Django Backend (Terminal 1)

In your first terminal tab:

```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# (If PowerShell blocks script execution, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass)

# 3. Apply database migrations
python manage.py migrate

# 4. Start the Django development server
python manage.py runserver 127.0.0.1:8000
```

> **How to identify this terminal:** Look for `(venv)` in the prompt and `Starting development server at http://127.0.0.1:8000/`.

---

### Step 3: Start the React Frontend (Terminal 2)

1. Open a **second terminal tab** in VS Code by clicking the **`+` (New Terminal)** icon.
2. Run:

```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Start the Vite development server
npm run dev
```

> **How to identify this terminal:** Look for `VITE ready` and `➜ Local: http://127.0.0.1:5173/`.

---

### Step 4: Open in Browser

Go to:
👉 **[http://localhost:5173](http://localhost:5173)** (or `http://127.0.0.1:5173`)

You will immediately land on the homepage where you can launch the planner, add your courses, switch themes, and export your timetable.

---

## How to Stop and Restart

- **To Stop:** Click on each terminal and press `Ctrl + C`.
- **To Restart:** Run `python manage.py runserver 127.0.0.1:8000` in Terminal 1, and `npm run dev` in Terminal 2.

---

## Running Automated Tests

To verify backend scheduling math and interval logic:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py test tests
```

---

## License

MIT License. Designed with care for students everywhere.
