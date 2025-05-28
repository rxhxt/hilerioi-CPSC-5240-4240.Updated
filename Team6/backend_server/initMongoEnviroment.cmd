@echo off
setlocal

REM Ensure .\db exists
IF NOT EXIST ".\db" (
    echo Creating database directory .\db...
    mkdir ".\db"
) ELSE (
    echo Found existing database directory .\db.
)

REM Start MongoDB
echo Starting MongoDB...
start mongod --port 3000 --dbpath ".\db"
timeout /t 3 >nul

REM Check if dbAdmin exists and create if not
echo Checking for existing dbAdmin user...
mongosh --port 3000 admin --eval ^
"if (!db.getUser('dbAdmin')) { db.createUser({user: 'dbAdmin', pwd: 'test', roles: ['readWriteAnyDatabase', 'dbAdminAnyDatabase', 'clusterAdmin']}); print('dbAdmin created'); } else { print('dbAdmin already exists'); }"

pause
