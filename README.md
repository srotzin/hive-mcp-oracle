# HiveOracle

**Oracle aggregator MCP server — signed price feeds, off-chain data, and x402-gated threshold subscriptions**

`hive-mcp-oracle` is an MCP server for the Hive Oracle aggregator. Agents browse the full catalog of available price feeds and off-chain data sources, fetch cryptographically signed price quotes for any symbol, subscribe to threshold-triggered notifications with USDC settlement via x402, and verify oracle signatures against quote payloads.

> **Backend status:** The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data is returned. Backend target: Q3 2026.

> Council R4 — staged for Q3 2026 backend build

---

## Backend Status

All `tools/call` requests return HTTP 503:
```json
{ "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
```
`tools/list`, `/health`, and `/.well-known/mcp.json` are operational and return the full tool catalog.
No mock data is returned at any point.

---

## Protocol

- **Spec:** MCP 2024-11-05 over Streamable-HTTP / JSON-RPC 2.0
- **Transport:** `POST /mcp`
- **Discovery:** `GET /.well-known/mcp.json`
- **Health:** `GET /health`
- **Settlement:** USDC on Base, Ethereum, Solana via x402 (real rails only)
- **Brand gold:** Pantone 1245 C / `#C08D23`
- **Tools:** 4

---

## Tools

| Tool | Description |
|---|---|
| `list_feeds` | Lists all available oracle data feeds: price feeds, off-chain event feeds, and index feeds. Returns catalog with symbol, description, update frequency, and data source. Backend pending (Q3 2026). |
| `get_price` | Returns a cryptographically signed price quote for a given symbol. Response includes price, timestamp, and oracle signature for on-chain verification. Backend pending (Q3 2026). |
| `subscribe` | Subscribes to threshold-triggered oracle notifications for a symbol. USDC settlement via x402 on Base, Ethereum, or Solana. Returns `subscription_id`. Backend pending (Q3 2026). |
| `verify_signature` | Verifies the cryptographic signature on an oracle quote. Returns boolean. Backend pending (Q3 2026). |

---

## Backend Endpoints (pending Q3 2026)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/oracle/feeds` | List all available feeds (price, event, index) |
| `GET` | `/v1/oracle/price` | Signed price quote for a symbol |
| `POST` | `/v1/oracle/subscribe` | Subscribe to threshold notifications (x402) |
| `POST` | `/v1/oracle/verify` | Verify oracle signature on a quote |

---

## Run Locally

```bash
git clone https://github.com/srotzin/hive-mcp-oracle.git
cd hive-mcp-oracle
npm install
npm start
# Server on http://localhost:3000
# tools/list returns tool catalog; tools/call returns 503 (backend pending)
curl http://localhost:3000/health
curl http://localhost:3000/.well-known/mcp.json
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq .result.tools[].name
```

---

## Connect from an MCP Client

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "hive_mcp_oracle": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://your-deployed-host/mcp"]
    }
  }
}
```

---

## Hive Civilization

Part of the [Hive Civilization](https://www.thehiveryiq.com) — sovereign DID, USDC settlement, HAHS legal contracts, agent-to-agent rails.

## License

MIT (c) 2026 Steve Rotzin / Hive Civilization
