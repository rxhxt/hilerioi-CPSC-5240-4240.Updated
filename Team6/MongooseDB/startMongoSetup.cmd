@echo off
echo Starting MongoDB...
start mongod --port 3000 --dbpath ".\db"
timeout /t 3

echo Creating admin user (if not already exists)...
mongosh --port 3000 admin ".\createDB\createAdminUser.js"

echo Seeding jobposts...
mongosh --port 3000 jobfetchr ".\createDB\jobpostseed.js"

echo Seeding appliedjobs...
mongosh --port 3000 jobfetchr ".\createDB\appliedjobseed.js"

echo Database setup complete.
pause
