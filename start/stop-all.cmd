@echo off
setlocal EnableExtensions

echo Stopping Java and Vite processes started for the local stack...
taskkill /FI "WINDOWTITLE eq Eureka Server" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Authentication Service" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Customer Service" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Transfer Service" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Public Info Service" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq API Gateway" /T /F >nul 2>nul
taskkill /FI "WINDOWTITLE eq Prestige Frontend" /T /F >nul 2>nul
echo Stop requests sent.
