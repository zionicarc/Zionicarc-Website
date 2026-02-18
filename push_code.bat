@echo off
echo Pushing code to https://github.com/zionicarc/Zionicarc-Website...
git remote set-url origin https://github.com/zionicarc/Zionicarc-Website
git push -u origin main
echo.
echo If the push failed, please ensure you are logged in or have permissions.
pause
