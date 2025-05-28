#!/bin/bash

# Ensure ./db exists
if [ ! -d "./db" ]; then
    echo "Creating database directory ./db..."
    mkdir "./db"
else
    echo "Found existing database directory ./db."
fi

# Start MongoDB
echo "Starting MongoDB..."
mongod --port 3000 --dbpath "./db" &

# Wait for MongoDB to start
echo "Waiting for MongoDB to start..."
sleep 3

# Check if dbAdmin exists and create if not
echo "Checking for existing dbAdmin user..."
mongosh --port 3000 admin --eval '
if (!db.getUser("dbAdmin")) { 
    db.createUser({
        user: "dbAdmin", 
        pwd: "test", 
        roles: ["readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin"]
    }); 
    print("dbAdmin created"); 
} else { 
    print("dbAdmin already exists"); 
}'


read -p "Press Enter to terminate MongoDB and exit..."


pkill mongod