# Student Schedule Planner

A minimalist, typography-first timetable planning tool for college and university students. Enter courses manually or import spreadsheets, detect time conflicts, generate valid schedules, and export your weekly schedule as a clean image or PDF.

---

## Quick Start Guide for Windows (VS Code)

To run the application, you need **two separate terminal tabs** in VS Code:
- **Terminal 1:** Django Backend (API & Database)
- **Terminal 2:** React + Vite Frontend (User Interface)

---

### Step 1: Open Your Workspace in VS Code

1. Open VS Code.
2. Go to **File > Open Folder...** and select `C:\Users\james\Documents\ORAS`.
3. Open a terminal by pressing `` Ctrl + ` `` (Backtick) or selecting **Terminal > New Terminal** from the top menu.

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

> **How to identify this terminal:** Look for the `(venv)` prefix in the prompt and `Starting development server at http://127.0.0.1:8000/`.

---

### Step 3: Start the React Frontend (Terminal 2)

1. In VS Code, open a **second terminal tab** by clicking the **`+` (Split or New Terminal)** button in the terminal panel.
2. In this second terminal tab, run:

```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Start the Vite development server
npm run dev
```

> **How to identify this terminal:** Look for `VITE v6.x ready` and `➜ Local: http://127.0.0.1:5173/`.

---

### Step 4: Open the App in Your Browser

Open your web browser and go to:
👉 **[http://localhost:5173](http://localhost:5173)** (or `http://127.0.0.1:5173`)

- **Instant Anonymous Access:** You do not need to register or log in. You can start building schedules, adding classes, and exporting immediately.
- Optional sign-in is available in the bottom corner if you want an account.

---

## How to Stop and Restart the Application

### To Stop:
1. Click on **Terminal 1 (Backend)** and press `Ctrl + C`.
2. Click on **Terminal 2 (Frontend)** and press `Ctrl + C`.

### To Restart:
- In Terminal 1 (`backend`): run `python manage.py runserver 127.0.0.1:8000`
- In Terminal 2 (`frontend`): run `npm run dev`

---

## Useful Development Commands

### Missing Dependencies?
If you ever clone this repository fresh or need to reinstall dependencies:

**Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
npm install
```

### Database Migrations
Whenever the data models change:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py makemigrations
python manage.py migrate
```

### Create a Superuser / Admin Account
To access Django's admin portal at `http://127.0.0.1:8000/admin/`:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py createsuperuser
```

### Run Automated Tests
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py test tests
```

---

## Common Issues & Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `Scripts\Activate.ps1 cannot be loaded because running scripts is disabled` | Windows PowerShell execution policy | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your terminal and re-run the activate command. |
| `node is not recognized` | Node.js is not in your current shell's PATH | Ensure `C:\Users\james\.local\node-v22.14.0-win-x64` is in PATH or restart VS Code so the user environment updates. |
| `Port 8000 is already in use` | A previous Django server is still running in the background | In PowerShell, run `Get-Process python -ErrorAction SilentlyContinue \| Stop-Process -Force` |
| `Port 5173 is already in use` | A previous Vite server is still running | In PowerShell, run `Get-Process node -ErrorAction SilentlyContinue \| Stop-Process -Force` |
| `CSRF token missing or incorrect` | Cookie issues when testing API directly | Use browser with `credentials: 'include'` or fetch `/api/auth/csrf/` first. |
