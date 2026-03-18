@echo off
echo Starting Backend Server...
start "Backend" cmd /k "call .venv\Scripts\activate && cd backend && python main.py"

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo All servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
