#!/usr/bin/env node
/**
 * HiveOracle MCP Server
 * Agent-callable oracle aggregator for signed price feeds and off-chain data with x402 subscriptions
 *
 * Backend  : https://hivemorph.onrender.com
 * Status   : v0.1 — pending hivemorph backend build (Q3 2026 spec)
 * Spec     : MCP 2024-11-05 / Streamable-HTTP / JSON-RPC 2.0
 * Brand    : Hive Civilization gold #C08D23 (Pantone 1245 C)
 *
 * RAILS RULE 1 — NO MOCK RESPONSES.
 * All tool calls return HTTP 503 until the backend is live.
 * Agents receive: { "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
 */

import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HIVE_BASE = process.env.HIVE_BASE || 'https://hivemorph.onrender.com';

// ─── Tool definitions ────────────────────────────────────────────────────────
const TOOLS = [
{
  name: 'list_feeds',
  description: 'List all available oracle data feeds: price feeds, off-chain event feeds, and index feeds. Returns catalog with symbol, description, update frequency, and data source. Backend pending (Q3 2026).',
  inputSchema: {
    type: 'object',
    properties: {

    },
  },
},    {
      name: 'get_price',
      description: 'Fetch a cryptographically signed price quote for a given symbol. Response includes price, timestamp, and oracle signature for on-chain verification. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["symbol"],
properties: {
          symbol: { type: 'string', description: 'Feed symbol (e.g. BTC-USD, ETH-USD, SOL-USD, custom index)' }
        },
      },
    },    {
      name: 'subscribe',
      description: 'Subscribe to threshold-triggered oracle notifications for a symbol. USDC settlement via x402 on Base, Ethereum, or Solana. Returns subscription_id. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["symbol", "threshold"],
properties: {
          symbol: { type: 'string', description: 'Feed symbol to subscribe to' },
  threshold: { type: 'number', description: 'Price threshold that triggers a notification callback' }
        },
      },
    },    {
      name: 'verify_signature',
      description: 'Verify the cryptographic signature on an oracle quote. Returns boolean. Used by smart contracts and agent workflows to confirm data provenance. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["quote", "sig"],
properties: {
          quote: { type: 'string', description: 'JSON-serialized oracle quote object' },
  sig: { type: 'string', description: 'Oracle signature (hex-encoded)' }
        },
      },
    }
];

// ─── Feature-gate response (Rails Rule 1 — no mock) ──────────────────────────
function featureGate(res) {
  return res.status(503).json({
    error: 'feature gating: backend pending; submit interest at hive-mcp-connector',
    backend_status: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
    service: 'hive-mcp-oracle',
    interest_url: 'https://hive-mcp-connector.thehiveryiq.com',
  });
}

// ─── MCP JSON-RPC handler ────────────────────────────────────────────────────
app.post('/mcp', async (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC' } });
  }
  try {
    switch (method) {
      case 'initialize':
        return res.json({ jsonrpc: '2.0', id, result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'hive-mcp-oracle',
            version: '1.0.0',
            description: 'Agent-callable oracle aggregator for signed price feeds and off-chain data with x402 subscriptions',
            backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
          },
        } });
      case 'tools/list':
        return res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      case 'tools/call':
        // Rails Rule 1: backend not yet live — return honest 503, no mock data.
        return featureGate(res);
      case 'ping':
        return res.json({ jsonrpc: '2.0', id, result: {} });
      default:
        return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err) {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: err.message } });
  }
});

// ─── Discovery + health ──────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'hive-mcp-oracle',
  version: '1.0.0',
  backend: HIVE_BASE,
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  toolCount: TOOLS.length,
  brand: '#C08D23',
}));

app.get('/.well-known/mcp.json', (req, res) => res.json({
  name: 'hive-mcp-oracle',
  endpoint: '/mcp',
  transport: 'streamable-http',
  protocol: '2024-11-05',
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
}));

app.listen(PORT, () => {
  console.log('HiveOracle MCP Server running on :' + PORT);
  console.log('  Backend : ' + HIVE_BASE);
  console.log('  Status  : v0.1 — pending hivemorph backend build (Q3 2026 spec)');
  console.log('  Tools   : ' + TOOLS.length + ' (list_feeds, get_price, subscribe, verify_signature)');
  console.log('  Rails   : tool calls return 503 until backend is live (no mock)');
});
