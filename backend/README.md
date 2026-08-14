Northstar Backend
=================

This folder contains a minimal Express backend scaffold for the Northstar
Support Deflection MVP. It provides routes for Order Status and Returns
that delegate business rules to the Support Logic services (to be
implemented by the Support Logic Developer).

Prerequisites
-------------
- Node.js (LTS)
- Local MongoDB instance or `MONGODB_URI` pointing to a MongoDB server

Setup
-----
From the `backend` folder:

```bash
npm install
```

Seed the local database using the provided seed script at the repository root:

```powershell
# Windows PowerShell example
cd ..\
node database/seed.js
```

Start the backend:

```bash
cd backend
npm start
```

Endpoints
---------
- GET /api/orders/:orderId
  - Returns the exact response shape defined in `docs/architecture.md`.

- GET /api/returns/:orderId
  - Returns the exact response shape defined in `docs/architecture.md`.

Notes for the Support Logic Developer
------------------------------------
- Implement business-rule services under `backend/src/services/supportLogic/`:
  - `ordersSupportService.js` should export `async function getOrderStatus(orderId)`
    and return an object matching the API contract from `docs/architecture.md`.
  - `returnsSupportService.js` should export `async function getReturnInfo(orderId)`
    and return an object matching the API contract.
- Controllers call `backend/src/services/supportLogicInterface.js`, which will
  delegate to the service modules when they are implemented. Until then,
  requests will return 404.

Testing
-------
After seeding and starting the server, example requests:

```bash
curl http://localhost:3000/api/orders/NS-1001
curl http://localhost:3000/api/returns/NS-1001
```

The Support Logic services must return objects with fields exactly matching
`docs/architecture.md` (do not add or rename fields in the controller layer).
