# Database Schema — Northstar Support Deflection MVP
**Owner:** Database Developer · **Stack:** MongoDB (per `docs/architecture.md` §3) · **Scope:** Order Status + Returns/Refunds — Stock Availability is out of MVP scope per architecture.md §1, so there's no inventory collection here.

## Why this shape
Per the project rules: no unnecessary entities, no fields added just because a model suggests them, and no schema changes without checking the backend's API needs. Concretely:
- **No `customers` collection.** This MVP has no login/account system — `customerEmail` lives directly on the order, which is enough to identify a person in a support conversation.
- **`eligible` is computed, not stored.** The `GET /api/returns/:orderId` contract in `docs/architecture.md` returns an `eligible` field, but it isn't a column in the `returns` collection — storing it would create two sources of truth (the field and the actual order/return state it depends on). It's derived at query time: `Delivered` order status + no existing non-rejected return. See `database/queries.md`.
- **Two collections total:** `orders` and `returns`, linked by `orderId`. That's the full relationship graph this MVP needs.

## Collections

### `orders`
| Field | Type | Notes |
|---|---|---|
| `orderId` | String, unique, indexed | Business key, e.g. `NS-1001` — what a customer actually types into support. |
| `customerEmail` | String | Identifies whose order this is; no separate customer collection. |
| `itemName` | String | Single item per order at MVP scope. |
| `orderDate` | String (ISO date) | |
| `status` | String enum: `Processing` / `Shipped` / `Delivered` / `Delayed` | High-level lifecycle stage — what `GET /api/orders/:orderId` returns as `status`. |
| `shipmentStatus` | String, nullable | Carrier-side granularity (e.g. `"In Transit"`, `"Delivered"`) — null while `Processing`, since there's nothing to track yet. This is deliberately separate from `status`: `status` is the order lifecycle stage, `shipmentStatus` is what the carrier is reporting, and the existing API contract already expects both as distinct fields. |
| `carrier` | String, nullable | Null while `Processing`. |
| `trackingNumber` | String, nullable | Null while `Processing`. |
| `expectedDelivery` | String (ISO date), nullable | The ETA the frontend shows; matches `expectedDelivery` in the API contract. |

### `returns`
Only has a document once a customer actually requests a return — it's not pre-created per order.

| Field | Type | Notes |
|---|---|---|
| `returnId` | String, unique | e.g. `RT-2001`. |
| `orderId` | String, indexed, references `orders.orderId` | |
| `reason` | String | What the customer says; useful if it escalates to a human. |
| `returnStatus` | String enum: `Requested` / `In Transit` / `Received` / `Rejected` | Where the physical item is. |
| `refundStatus` | String enum: `Not Started` / `Processing` / `Refunded` | Where the money is — kept separate from `returnStatus` because an item can be `Received` while the refund is still `Not Started`; that's a real state the Support Logic dev's rules need to distinguish. |
| `requestedDate` | String (ISO date) | |
| `refundCompletedDate` | String (ISO date), nullable | Set only once `refundStatus` is `Refunded`. |

## Files in this handoff
| File | Contents |
|---|---|
| `database/schema.md` | This document |
| `database/sample-data.json` | Fixture data — 6 orders, 2 returns, covering every required demo scenario |
| `database/seed.js` | Node.js script to load the fixtures into MongoDB (`MONGODB_URI=... node database/seed.js`) |
| `database/queries.md` | The exact query logic for each API endpoint in `docs/architecture.md` §6, verified against the fixtures |

## Demo scenario coverage
| Required scenario | Record |
|---|---|
| A shipped order | `NS-1001` |
| An order still processing | `NS-1002` |
| An eligible return | `NS-1003` — delivered, no return filed yet |
| A return in progress | `RT-2001` on `NS-1005` |
| A completed/refunded return | `RT-2002` on `NS-1006` |

Bonus: `NS-1004` is `Delayed`, since `status` has to support that value regardless of whether it's in the minimum required list.

## Verified before this branch was pushed
- `seed.js` passes `node --check` (syntax valid).
- The exact query logic in `queries.md` was run against `sample-data.json` in Node — all 6 outputs (order status ×2, returns ×4) match the table in `queries.md` exactly, including the not-yet-delivered → `eligible: false` case.
- Not yet run against a live MongoDB instance (none reachable from this environment) — `seed.js` itself hasn't been execution-tested against a real database, only checked for syntax. Whoever runs it first against a live Mongo instance should sanity-check the insert before relying on it.

## Open items for the Team Lead / Backend Developer
1. `status` values are capitalized (`"Shipped"`, `"Processing"`, `"Delivered"`) — checked this against `frontend/script.js` and `frontend/order-status.html`, both already use the same casing, so this schema is consistent with what the frontend expects.
2. `queries.md` includes a support-agent lookup by customer email that isn't in the current API contract list — flagging it in case QA/DevOps or the Support Logic dev wants an internal/admin endpoint for it; not built as a route, just documented as available.
