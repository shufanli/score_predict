@echo off
chcp 65001 >nul
REM 问卷系统本地服务器启动脚本 (Windows)
REM 使用方法：双击运行此文件

echo ================================================
echo    复读提分预测问卷系统 - 本地服务器启动
echo ================================================
echo.

REM 切换到脚本所在目录
cd /d "%~dp0"

echo 📂 工作目录: %CD%
echo.

REM 检测 Python 3
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python --version 2>&1 | findstr /C:"Python 3" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ 检测到 Python 3
        goto :startPython3
    )
)

REM 检测 Python 命令
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 Python 3
    goto :startPython3
)

REM 检测 Python 2
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 Python 2
    goto :startPython2
)

REM 未找到 Python
echo ❌ 未检测到 Python
echo.
echo 请安装 Python：
echo   下载地址: https://python.org
echo.
echo 或者使用 VS Code 的 Live Server 扩展
echo.
pause
exit /b 1

:startPython3
echo 🚀 启动服务器...
echo.
echo 访问地址: http://localhost:8000/index.html
echo 管理面板: http://localhost:8000/admin.html
echo.
echo 按 Ctrl+C 停止服务器
echo ================================================
echo.
python -m http.server 8000
goto :end

:startPython2
echo 🚀 启动服务器...
echo.
echo 访问地址: http://localhost:8000/index.html
echo 管理面板: http://localhost:8000/admin.html
echo.
echo 按 Ctrl+C 停止服务器
echo ================================================
echo.
python -m SimpleHTTPServer 8000
goto :end

:end
pause
