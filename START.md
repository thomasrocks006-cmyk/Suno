# Suno Architect - Quick Start

## Running the Application

### Default (with Cloudflare Tunnel)
```bash
npm start
```
This will start the dev server and create a public Cloudflare tunnel URL automatically.

### Alternative Commands
- `npm run tunnel` - Same as `npm start`, creates a Cloudflare tunnel
- `npm run dev` - Run locally only (http://localhost:3000)

## Public URL
When you run `npm start` or `npm run tunnel`, you'll get a public URL like:
```
https://your-unique-url.trycloudflare.com
```

This URL can be accessed from anywhere and is perfect for testing and sharing.
