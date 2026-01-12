#!/bin/bash

# 问卷系统本地服务器启动脚本
# 使用方法：在终端运行 ./start.sh

echo "================================================"
echo "   复读提分预测问卷系统 - 本地服务器启动"
echo "================================================"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📂 工作目录: $SCRIPT_DIR"
echo ""

# 检测可用的 HTTP 服务器
if command -v python3 &> /dev/null; then
    echo "✅ 检测到 Python 3"
    echo "🚀 启动服务器..."
    echo ""
    echo "访问地址: http://localhost:8000/index.html"
    echo "管理面板: http://localhost:8000/admin.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================================"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 检测到 Python 2"
    echo "🚀 启动服务器..."
    echo ""
    echo "访问地址: http://localhost:8000/index.html"
    echo "管理面板: http://localhost:8000/admin.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================================"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    echo "✅ 检测到 PHP"
    echo "🚀 启动服务器..."
    echo ""
    echo "访问地址: http://localhost:8000/index.html"
    echo "管理面板: http://localhost:8000/admin.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================================"
    echo ""
    php -S localhost:8000
else
    echo "❌ 未检测到可用的 HTTP 服务器"
    echo ""
    echo "请安装以下任一工具："
    echo "  - Python 3 (推荐): https://python.org"
    echo "  - Node.js: https://nodejs.org"
    echo "  - PHP: https://php.net"
    echo ""
    echo "或者使用 VS Code 的 Live Server 扩展"
    echo ""
    exit 1
fi
