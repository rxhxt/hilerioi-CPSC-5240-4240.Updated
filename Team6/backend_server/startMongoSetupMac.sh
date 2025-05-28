#!/bin/bash

echo "Starting MongoDB..."
mongod --port 3000 --dbpath "./db" &

#wait for MongoDB to start
echo "Waiting for MongoDB to initialize..."
sleep 3

echo "Creating admin user (if not already exists)..."
mongosh --port 3000 admin "./createDB/createAdminUser.js"

echo "Seeding jobposts..."
mongosh --port 3000 jobfetchr "./createDB/jobpostseed.js"

echo "Seeding appliedjobs..."
mongosh --port 3000 jobfetchr "./createDB/appliedjobseed.js"

echo "Database setup complete."

#continue to run until user presses Enter
read -p "Press Enter to terminate MongoDB and exit..."

#kill MongoDB process
pkill mongod