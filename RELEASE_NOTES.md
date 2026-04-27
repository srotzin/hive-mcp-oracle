# HiveOracle MCP Server — v1.0.0

## Overview

Initial scaffold for `hive-mcp-oracle`. The MCP server is structurally complete: `tools/list`, `/health`, and `/.well-known/mcp.json` are operational. The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data, no simulated responses.

---

## Tools

| Tool | Description |
|---|---|
| `list_feeds` | Lists all available oracle data feeds: price feeds, off-chain event feeds, and index feeds. Returns catalog with symbol, description, update frequency, and data source. Backend pending (Q3 2026). |
| `get_price` | Returns a cryptographically signed price quote for a given symbol. Response includes price, timestamp, and oracle signature for on-chain verification. Backend pending (Q3 2026). |
| `subscribe` | Subscribes to threshold-triggered oracle notifications for a symbol. USDC settlement via x402 on Base, Ethereum, or Solana. Returns `subscription_id`. Backend pending (Q3 2026). |
| `verify_signature` | Verifies the cryptographic signature on an oracle quote. Returns boolean. Backend pending (Q3 2026). |

---

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/oracle/feeds` | List all available feeds (price, event, index) |
| `GET` | `/v1/oracle/price` | Signed price quote for a symbol |
| `POST` | `/v1/oracle/subscribe` | Subscribe to threshold notifications (x402) |
| `POST` | `/v1/oracle/verify` | Verify oracle signature on a quote |

---

## Settlement

USDC on Base, Ethereum, or Solana via x402 (subscription notifications). No mock, no simulated settlement.

---

## Status

- **Backend:** v0.1 — pending hivemorph build (Q3 2026 spec)
- **Council:** R4
- **`tools/list`:** operational
- **`/health`:** operational
- **`/.well-known/mcp.json`:** operational
- **`tools/call`:** returns HTTP 503

```json
{
  "error": "feature gating: backend pending; submit interest at hive-mcp-connector",
  "backend_status": "v0.1 — pending hivemorph backend build (Q3 2026 spec)",
  "service": "hive-mcp-oracle",
  "interest_url": "https://hive-mcp-connector.thehiveryiq.com"
}
```

---

## Constraints

- No mock data, no simulated settlement at any point
- Brand gold: Pantone 1245 C / `#C08D23`
- No energy futures, GAS-PERP, GPU-PERP, or HASHRATE-PERP
- LLM calls route only through `https://hivecompute-g2g7.onrender.com/v1/compute/chat/completions`
- hivemorph remains private; this repository is the public surface
