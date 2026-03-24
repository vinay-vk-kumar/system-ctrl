# Server Health Monitoring Dashboard

A highly polished, developer-centric server monitoring dashboard built with Next.js (App Router), Tailwind CSS v4, and Shadcn UI. It features a dark cyberpunk aesthetic mimicking advanced Linux terminals and IDE environments.

## Features

- **Real-Time Telemetry**: Tracks CPU, Memory, Disk, Uptime, and Network stats locally using `systeminformation`.
- **PM2 Integration**: View active `pm2` processes, telemetry, and live out/error logs directly in the browser via native programmatic APIs.
- **Nginx Monitoring**: Keep track of dynamic Nginx connections.
- **Dynamic Ping Registry**: Ping and monitor multiple external services (e.g. `*.codewithvin.app`) and visualize HTTP response times directly.
- **Cyberpunk Terminal UI**: Features glowing neon graphs, hardware-accelerated transitions, and a customized Web Terminal component with live log streaming.

## Installation

```bash
npm install
```

### Environment Variables

If you wish to utilize the remote PM2 Restart functionality, you must set an authorization key.
Create a `.env` file at the root of the project:

```env
RESTART_KEY="your-super-secret-key"
```

## Running the Application

```bash
npm run dev
```

For production deployment:

```bash
npm run build
npm run start
```

## PM2 Features & Actions

On the **PM2 Processes** dashboard page, you can monitor and manage your local processes managed by PM2. 

### Available Actions:
1. **View Logs**: Click the purple **Logs** button to open the Terminal Sidebar. This streams that specific process's tail logs (`~/.pm2/logs`) inside an intelligent, color-coded terminal viewer.
2. **Restart Process**: Click the red **Restart** button to trigger a graceful restart of that PM2 ID. 
   - *Note*: It will safely prompt you for the `RESTART_KEY`. You must enter the exact string you configured in your `.env` file, or the backend will reject the command as Unauthorized.
