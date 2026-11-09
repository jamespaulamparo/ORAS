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
- **Universal, Free & Open Source:** 100% free forever, no subscription gates, zero tracking or telemetry, completely private and client-side safe. Built for college & university students worldwide, irregular students, working scholars, and busy individuals.
- **Zero Friction & Anonymous by Default:** No registration or login required. Your classes persist automatically in your browser session.
- **Automated Schedule Generator (Milestone 3):** Deterministic backtracking constraint solver that tests all section combinations, prunes collisions (`[start, end)` half-open interval arithmetic), scores alternatives based on your personal lifestyle preferences (Morning Bird vs. Afternoon Focus, Compact Days, Free Fridays, Gap Minimization), and applies the optimal schedule in 1 click.
- **Spreadsheet & CSV Batch Importer (Milestone 2):** Drag-and-drop `.csv`, `.tsv`, `.txt` files or paste raw spreadsheet rows directly from Google Sheets or Excel with automatic header detection, validation, and batch insertion.
- **Full Production Exports (PNG, PDF, iCalendar):** Export your clean weekly schedule as a high-resolution PNG image, print-optimized clean PDF, or universal standard `.ics` (iCalendar) file compatible with Google Calendar, Apple Calendar, and Outlook.
- **Click-to-Schedule on Empty Slots:** Tap or click any blank spot on the timetable grid; ORAS automatically calculates the time offset, snaps down to `:00` or `:30`, and presents a prefilled 1-hour session dialog.
- **Strict Half-Hour Increments:** Class times snap to `:00` and `:30` (e.g. `08:30 – 10:00`), preventing input typos and matching standard academic periods.
- **DMMMSU-NLUC & General Curricula:** Preloaded with BSIS curriculum offerings, common course codes, plus universal custom course support.
- **Dual Sidebar Architecture:** Inside the Schedule Workspace (`/schedules`), an Ellipsus-inspired focused tool rail puts subject management, diagnostic conflict indicators, view toggles, and exports directly at your fingertips, while the main sidebar handles general app navigation.
- **Timey Mascot & Micro-Animations:** Baymax-inspired friendly clock companion **Timey**, Framer Motion scroll-linked timepiece dynamics, rotating reflections ticker, and tactile tap feedback (`whileTap={{ scale: 0.97 }}`).
- **Dedicated Academic Research Page (`/about`):** Detailed research on the enrollment scramble, irregular student dilemmas, transit gap penalties, and why deterministic typographic software outperforms AI chatbots.
- **Mathematical Half-Open Interval Validation:** Classes ending at 10:30 and starting at 10:30 do not trigger false conflicts. Overlaps are highlighted with exact diagnostic messages.
- **16 Ellipsus-Inspired Themes:** 8 rich Dark themes (Leatherbound, Red Velvet, Ultra Dark, Midnight, Graphite, Espresso, Evergreen, Sepia) and 8 Light themes (Sage [Default], Paper, Maple, Pumpkin Spice, Valentine, Roseglow, Sandstone, Minimal).
- **Enrolled Classes Summary Table:** Color-coded summary below the timetable grid listing subject codes, titles, section codes, unit counts, meeting times, and rooms.
- **Fully Responsive:** 100% width on mobile screens with zero horizontal scrolling, plus a 1-click single-day inspector view.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Plus Jakarta Sans |
| **Backend** | Python 3.14, Django 5.x, Django REST Framework, SQLite / PostgreSQL |
| **Styling** | Semantic CSS Variables, 16 Ellipsus Themes, Custom Hex Color Picker |
| **Testing** | Django TestCase (`Ran 12 tests in 1.27s OK`) |

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
