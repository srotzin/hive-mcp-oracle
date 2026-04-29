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
import { renderLanding, renderRobots, renderSitemap, renderSecurity, renderOgImage, seoJson, BRAND_GOLD } from './meta.js';

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


const SERVICE_CFG = {
  service: "hive-mcp-oracle",
  shortName: "HiveOracle",
  title: "HiveOracle \u00b7 Price Feeds, TWAPs & Oracle Service MCP",
  tagline: "Price feeds, TWAPs, and oracle service for autonomous agent settlement.",
  description: "MCP server for HiveOracle \u2014 price feeds, TWAPs, and oracle service on the Hive Civilization. Aggregated multi-source feeds for autonomous agent trading and settlement. USDC settlement on Base L2. Real rails, no mocks.",
  keywords: ["mcp", "model-context-protocol", "x402", "agentic", "ai-agent", "ai-agents", "llm", "hive", "hive-civilization", "oracle", "price-oracles", "price-feeds", "twap", "oracle-service", "usdc", "base", "base-l2", "agent-economy", "a2a"],
  externalUrl: "https://hive-mcp-oracle.onrender.com",
  gatewayMount: "/oracle",
  version: "1.0.1",
  pricing: [
    { name: "oracle_get_price", priceUsd: 0.001, label: "Get price (Tier 1)" },
    { name: "oracle_get_twap", priceUsd: 0.001, label: "Get TWAP (Tier 1)" },
    { name: "oracle_subscribe", priceUsd: 0.05, label: "Subscribe feed (Tier 3)" }
  ],
};
SERVICE_CFG.tools = (typeof TOOLS !== 'undefined' ? TOOLS : []).map(t => ({ name: t.name, description: t.description }));
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


// HIVE_META_BLOCK_v1 — comprehensive meta tags + JSON-LD + crawler discovery
app.get('/', (req, res) => {
  res.type('text/html; charset=utf-8').send(renderLanding(SERVICE_CFG));
});
app.get('/og.svg', (req, res) => {
  res.type('image/svg+xml').send(renderOgImage(SERVICE_CFG));
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(renderRobots(SERVICE_CFG));
});
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(renderSitemap(SERVICE_CFG));
});
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(renderSecurity());
});
app.get('/seo.json', (req, res) => res.json(seoJson(SERVICE_CFG)));

app.get('/.well-known/agent-card.json', (req, res) => res.json({
  protocolVersion: '0.3.0',
  name: 'hive-mcp-oracle',
  description: "Hive Civilization oracle MCP — pay-per-feed price oracle with x402 USDC settlement.",
  url: 'https://hive-mcp-oracle.onrender.com',
  version: '1.0.2',
  provider: { organization: 'Hive Civilization', url: 'https://hiveagentiq.com' },
  capabilities: { streaming: false, pushNotifications: false },
  defaultInputModes: ['application/json'],
  defaultOutputModes: ['application/json'],
  authentication: { schemes: ['x402', 'api-key'] },
  payment: {
    protocol: 'x402', currency: 'USDC', network: 'base',
    address: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e'
  },
  extensions: {
    hive_pricing: {
      currency: 'USDC', network: 'base', model: 'per_call',
      first_call_free: true, loyalty_threshold: 6,
      loyalty_message: 'Every 6th paid call is free'
    }
  },
  bogo: {
    first_call_free: true, loyalty_threshold: 6,
    pitch: "Pay this once, your 6th paid call is on the house. New here? Add header 'x-hive-did' to claim your first call free.",
    claim_with: 'x-hive-did header'
  }
}));

app.get('/.well-known/ap2.json', (req, res) => res.json({
  ap2_version: '1.0',
  agent: 'hive-mcp-oracle',
  payment_methods: ['x402-usdc-base'],
  treasury: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
  bogo: { first_call_free: true, loyalty_threshold: 6, claim_with: 'x-hive-did header' }
}));

app.listen(PORT, () => {
  console.log('HiveOracle MCP Server running on :' + PORT);
  console.log('  Backend : ' + HIVE_BASE);
  console.log('  Status  : v0.1 — pending hivemorph backend build (Q3 2026 spec)');
  console.log('  Tools   : ' + TOOLS.length + ' (list_feeds, get_price, subscribe, verify_signature)');
  console.log('  Rails   : tool calls return 503 until backend is live (no mock)');
});
