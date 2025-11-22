#!/bin/bash

# Start Vite dev server in the background
npm run dev &

# Wait for Vite to be ready
echo "Waiting for Vite server to start..."
sleep 3

# Start Cloudflare tunnel
echo "Starting Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:3000
