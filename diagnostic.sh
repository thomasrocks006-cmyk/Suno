#!/bin/bash

echo "==============================================="
echo "   SUNO ARCHITECT - SELF-DIAGNOSTIC SYSTEM"
echo "==============================================="

# 1. Environment Check
echo "[1/6] Checking Environment..."
if [ -f .env ]; then
    echo "✅ .env file found."
    if grep -q "GEMINI_API_KEY" .env; then echo "✅ GEMINI_API_KEY present."; else echo "❌ GEMINI_API_KEY missing."; fi
    if grep -q "SUNO_API_KEY" .env; then echo "✅ SUNO_API_KEY present."; else echo "❌ SUNO_API_KEY missing."; fi
else
    echo "❌ .env file NOT found."
fi

# 2. Network Interface Check
echo -e "\n[2/6] Checking Network Interfaces..."
ip addr show eth0 | grep inet
echo "Hostname: $(hostname)"
echo "Local IP: $(hostname -I)"

# 3. Port Availability
echo -e "\n[3/6] Checking Port 3000..."
if netstat -tuln | grep ":3000 " > /dev/null; then
    echo "⚠️  Port 3000 is already in use! Attempting to identify process..."
    lsof -i :3000
else
    echo "✅ Port 3000 is free."
fi

# 4. Build Verification
echo -e "\n[4/6] Verifying Build..."
if npm run build; then
    echo "✅ Build successful."
else
    echo "❌ Build FAILED."
    exit 1
fi

# 5. Server Launch Simulation
echo -e "\n[5/6] Launching Server (Preview Mode)..."
nohup npm run preview -- --host 0.0.0.0 --port 3000 > diagnostic_server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
echo "Waiting 5 seconds for server to stabilize..."
sleep 5

# 6. Connectivity Test
echo -e "\n[6/6] Testing Connectivity..."

# Check if process is still running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server process is running."
else
    echo "❌ Server process DIED immediately. Checking logs:"
    cat diagnostic_server.log
    exit 1
fi

# Test Localhost
echo -n "Testing localhost:3000... "
if curl -s -I http://localhost:3000 | grep "200 OK" > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

# Test 127.0.0.1
echo -n "Testing 127.0.0.1:3000... "
if curl -s -I http://127.0.0.1:3000 | grep "200 OK" > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

# Test Container IP
IP=$(hostname -I | awk '{print $1}')
echo -n "Testing Container IP ($IP:3000)... "
if curl -s -I http://$IP:3000 | grep "200 OK" > /dev/null; then
    echo "✅ OK"
else
    echo "❌ FAILED"
fi

echo -e "\n==============================================="
echo "   DIAGNOSTIC COMPLETE"
echo "==============================================="
echo "Server Log Output (Last 10 lines):"
tail -n 10 diagnostic_server.log
