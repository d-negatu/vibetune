@echo off
echo 🚀 Starting Firebase Emulator...
echo This will run your Cloud Functions locally at http://localhost:5001
echo.
firebase emulators:start --only functions,firestore
