@echo off

echo Starting Ziya Giftz Development Server...
echo ==================================

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start the development server
echo Starting Angular development server...
ng serve --open --port 4200

echo Server should be running at http://localhost:4200
pause
