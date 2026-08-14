# Database Queries — Reference for the Backend Developer

These map directly to the endpoints already defined in `docs/architecture.md` §6. Copy the logic rather than re-deriving it, so eligibility rules live in one place.

## `GET /api/orders/:orderId`
```js
const order = await db.collection("orders").findOne({ orderId });
if (!order) return res.status(404).json({ error: "order not found" });

res.json({
  orderId: order.orderId,
  status: order.status,
  shipmentStatus: order.shipmentStatus,
  expectedDelivery: order.expectedDelivery,
});
```

## `GET /api/returns/:orderId`
Eligibility is **computed here, not stored** — there's no `eligible` field in the `returns` collection. An order is eligible if it's `Delivered` and has no existing non-rejected return on file. If a return already exists for the order, its real status is returned instead of a fresh eligibility check.

```js
const order = await db.collection("orders").findOne({ orderId });
if (!order) return res.status(404).json({ error: "order not found" });

const existingReturn = await db.collection("returns").findOne({
  orderId,
  returnStatus: { $ne: "Rejected" },
});

if (existingReturn) {
  return res.json({
    orderId,
    eligible: true,
    returnStatus: existingReturn.returnStatus,
    refundStatus: existingReturn.refundStatus,
  });
}

res.json({
  orderId,
  eligible: order.status === "Delivered",
  returnStatus: "Not Requested",
  refundStatus: null,
});
```

## Support-agent lookup (all orders + return state for one customer)
Not in the current API contract list, but flagged here in case the QA/DevOps or Support Logic dev needs an internal/admin view:
```js
const customerOrders = await db.collection("orders").find({ customerEmail }).toArray();
const orderIds = customerOrders.map(o => o.orderId);
const customerReturns = await db.collection("returns").find({ orderId: { $in: orderIds } }).toArray();
```

## Verified against `database/sample-data.json`
| Query | Input | Expected output |
|---|---|---|
| Order status | `NS-1001` | `status: "Shipped"`, `shipmentStatus: "In Transit"` |
| Order status | `NS-1002` | `status: "Processing"`, `shipmentStatus: null` |
| Returns (no return filed yet) | `NS-1003` | `eligible: true`, `returnStatus: "Not Requested"`, `refundStatus: null` |
| Returns (in progress) | `NS-1005` | `eligible: true`, `returnStatus: "In Transit"`, `refundStatus: "Not Started"` |
| Returns (completed) | `NS-1006` | `eligible: true`, `returnStatus: "Received"`, `refundStatus: "Refunded"` |
| Returns (not yet delivered) | `NS-1001` | `eligible: false`, `returnStatus: "Not Requested"`, `refundStatus: null` |

These were run against the fixture data in Node before committing — see `database/schema.md` for the verification note.
