import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { DEFAULT_MARKET_PRICES } from './src/data/constants';
import { AllMarketPrices, ResourceType, CityId } from './src/types/albion';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Persistent state storage directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'market_state.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let marketPrices: AllMarketPrices = JSON.parse(JSON.stringify(DEFAULT_MARKET_PRICES));

// Load persisted state if exists with deep merge for new fields
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const res of Object.keys(DEFAULT_MARKET_PRICES) as ResourceType[]) {
      if (!marketPrices[res]) marketPrices[res] = {} as any;
      for (const city of Object.keys(DEFAULT_MARKET_PRICES[res]) as CityId[]) {
        marketPrices[res][city] = {
          ...DEFAULT_MARKET_PRICES[res][city],
          ...(parsed?.[res]?.[city] || {})
        };
      }
    }
    console.log('[Server] Loaded and deep-merged persisted market state from disk.');
  } catch (err) {
    console.error('[Server] Failed to load persisted market state, using defaults:', err);
  }
} else {
  fs.writeFileSync(DATA_FILE, JSON.stringify(marketPrices, null, 2), 'utf-8');
}

let saveTimeout: NodeJS.Timeout | null = null;
function persistMarketPrices() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(marketPrices, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Server] Error saving market state to disk:', err);
    }
  }, 300);
}

// WebSocket Server initialization
const wss = new WebSocketServer({ server });
let connectedClientCount = 0;

function broadcast(message: object, excludeWs?: WebSocket) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws: WebSocket) => {
  connectedClientCount = wss.clients.size;
  console.log(`[WS] Client connected. Total online: ${connectedClientCount}`);

  // Send initial state to newly connected client
  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    payload: {
      prices: marketPrices,
      onlineCount: connectedClientCount,
      serverTime: Date.now()
    }
  }));

  // Broadcast presence update
  broadcast({
    type: 'PRESENCE_UPDATE',
    payload: { onlineCount: connectedClientCount }
  });

  ws.on('message', (messageRaw: string) => {
    try {
      const msg = JSON.parse(messageRaw.toString());
      if (msg.type === 'UPDATE_PRICE') {
        const { resource, city, field, value, updatedBy } = msg.payload as {
          resource: ResourceType;
          city: CityId;
          field: keyof CityPriceData;
          value: number;
          updatedBy?: string;
        };

        if (marketPrices[resource] && marketPrices[resource][city]) {
          (marketPrices[resource][city] as any)[field] = Math.max(0, Math.round(value));
          if (field === 't2RefinedBuyOrder') {
            marketPrices[resource][city].t2BuyOrder = Math.max(0, Math.round(value));
          } else if (field === 't2BuyOrder') {
            marketPrices[resource][city].t2RefinedBuyOrder = Math.max(0, Math.round(value));
          }
          marketPrices[resource][city].lastUpdated = Date.now();
          marketPrices[resource][city].updatedBy = updatedBy || 'Anonymous Crafter';

          persistMarketPrices();

          // Broadcast to all other clients
          broadcast({
            type: 'PRICE_CHANGED',
            payload: {
              resource,
              city,
              field,
              value: marketPrices[resource][city][field],
              updatedBy: marketPrices[resource][city].updatedBy,
              timestamp: Date.now()
            }
          }, ws);

          // Acknowledge to sender
          ws.send(JSON.stringify({
            type: 'UPDATE_ACK',
            payload: { resource, city, field, value: marketPrices[resource][city][field] }
          }));
        }
      } else if (msg.type === 'BATCH_UPDATE') {
        const { newPrices, updatedBy } = msg.payload;
        marketPrices = { ...marketPrices, ...newPrices };
        persistMarketPrices();

        broadcast({
          type: 'FULL_STATE_SYNC',
          payload: { prices: marketPrices, updatedBy, timestamp: Date.now() }
        });
      } else if (msg.type === 'RESET_PRICES') {
        marketPrices = JSON.parse(JSON.stringify(DEFAULT_MARKET_PRICES));
        persistMarketPrices();

        broadcast({
          type: 'FULL_STATE_SYNC',
          payload: { prices: marketPrices, reset: true, timestamp: Date.now() }
        });
      }
    } catch (err) {
      console.error('[WS] Error processing message:', err);
    }
  });

  ws.on('close', () => {
    connectedClientCount = wss.clients.size;
    console.log(`[WS] Client disconnected. Total online: ${connectedClientCount}`);
    broadcast({
      type: 'PRESENCE_UPDATE',
      payload: { onlineCount: connectedClientCount }
    });
  });

  ws.on('error', (err) => {
    console.error('[WS] Client socket error:', err);
  });
});

// REST API Endpoints
app.get('/api/prices', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: marketPrices,
    onlineCount: wss.clients.size,
    timestamp: Date.now()
  });
});

app.post('/api/prices', (req: Request, res: Response) => {
  const { resource, city, field, value, updatedBy } = req.body;
  if (!resource || !city || !field || value === undefined) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  if (marketPrices[resource as ResourceType]?.[city as CityId]) {
    marketPrices[resource as ResourceType][city as CityId][field as 't2BuyOrder' | 't3RawBuyOrder' | 't3RefinedSellOrder' | 'stationFee'] = Math.max(0, Math.round(Number(value)));
    marketPrices[resource as ResourceType][city as CityId].lastUpdated = Date.now();
    marketPrices[resource as ResourceType][city as CityId].updatedBy = updatedBy || 'Web API';
    persistMarketPrices();

    broadcast({
      type: 'PRICE_CHANGED',
      payload: {
        resource,
        city,
        field,
        value: marketPrices[resource as ResourceType][city as CityId][field as any],
        updatedBy: updatedBy || 'Web API',
        timestamp: Date.now()
      }
    });

    res.json({ success: true, data: marketPrices[resource as ResourceType][city as CityId] });
  } else {
    res.status(404).json({ success: false, error: 'Resource or city not found' });
  }
});

app.post('/api/prices/reset', (_req: Request, res: Response) => {
  marketPrices = JSON.parse(JSON.stringify(DEFAULT_MARKET_PRICES));
  persistMarketPrices();

  broadcast({
    type: 'FULL_STATE_SYNC',
    payload: { prices: marketPrices, reset: true, timestamp: Date.now() }
  });

  res.json({ success: true, message: 'All market prices reset to default Albion standards' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    clientsOnline: wss.clients.size,
    uptimeSeconds: process.uptime()
  });
});

// Mount Vite middleware in development or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Albion Server] Running on http://localhost:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
