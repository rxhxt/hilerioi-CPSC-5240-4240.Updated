@echo off
echo Testing JobPost API endpoints...

echo.
echo === GET ALL JOB POSTS ===
curl http://localhost:8080/api/v1/jobposts

echo.
echo.
echo === CREATE NEW JOB POST ===
curl -X POST http://localhost:8080/api/v1/jobposts ^
  -H "Content-Type: application/json" ^
  -d "{\"jobPostId\": \"TEST001\", \"position_title\": \"Software Engineer\", \"location\": \"Seattle, WA\", \"company\": \"Tech Company\", \"date_posted\": \"2025-05-05\", \"recruiter\": \"John Doe\", \"job_description\": \"Develop and maintain software applications\", \"salary\": 120000, \"status\": \"Open\", \"url\": \"https://example.com/jobs/123\", \"job_work_type\": \"Full-time\", \"is_remote\": true}"

echo.
echo.
echo === GET SPECIFIC JOB POST ===
curl http://localhost:8080/api/v1/jobposts/TEST001

echo.
echo.
echo === UPDATE JOB POST ===
curl -X PUT http://localhost:8080/api/v1/jobposts/TEST001 ^
  -H "Content-Type: application/json" ^
  -d "{\"position_title\": \"Senior Software Engineer\", \"salary\": 150000}"

echo.
echo.
echo === GET UPDATED JOB POST ===
curl http://localhost:8080/api/v1/jobposts/TEST001

echo.
echo.
echo === DELETE JOB POST ===
curl -X DELETE http://localhost:8080/api/v1/jobposts/TEST001

echo.
echo.
echo Testing completed!
pause