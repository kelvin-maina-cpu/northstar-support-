# Northstar Support Deflection MVP

## Project purpose

Northstar Support Deflection MVP is a lightweight support experience for Northstar Retail Co. The goal is to reduce repetitive customer-service work by handling common self-service requests for:

- Order status
- Returns and refunds

Stock availability is intentionally out of scope for the MVP unless the core flows are already stable and time allows.

## Included in the current MVP

- Customer-facing support interface
- Order status lookup flow
- Returns/refund guidance and submission flow
- Frontend validation and loading/error states
- Backend API skeleton for order and return requests
- Basic deployment and environment configuration guidance
- QA and go-live readiness documentation

## Architecture

The repository currently follows the project architecture described in the team docs:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Support logic: backend service adapters under `backend/src/services`

The main customer flows are implemented in the frontend and are designed to be demoable without introducing production secrets or extras.

## Technology stack

- React 19
- Vite
- React Router
- Express
- MongoDB Node driver

## Local setup

### 1. Install dependencies

From the repository root:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Create environment variables for local backend work:

```bash
export MONGODB_URI="mongodb://localhost:27017"
export DB_NAME="northstar"
export PORT="3000"
```

On Windows PowerShell:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017"
$env:DB_NAME="northstar"
$env:PORT="3000"
```

### 3. Seed the database (if using local MongoDB)

```bash
cd ..
node database/seed.js
```

### 4. Run the services

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend is expected to run on the Vite local URL printed in the terminal, most commonly `http://localhost:5173`.

## Deployment notes

Before deployment, confirm:

- `MONGODB_URI` points to the target environment
- `PORT` and backend URL are set correctly
- In Render, set `FRONTEND_URL` to `https://northstar-support-nine.vercel.app`
  (add `http://localhost:5173` after a comma if you also need local browser
  access), then redeploy the backend. Origins must be exact and must not end
  in a trailing slash.
- build and startup commands pass in the target environment
- no credentials or secrets are committed to the repository

## Testing

The MVP should be checked against the core user flows and validation cases below.

### Core flows

1. Order status lookup with a valid order number
2. Order status lookup with missing input
3. Order status lookup with invalid format
4. Order status lookup for a non-existent order ID
5. Returns/refunds help content and submission form
6. Returns form validation for required fields

### Recommended validation checklist

- Valid inputs
- Invalid inputs
- Missing inputs
- Non-existent IDs
- API errors
- Database errors
- Loading states
- UI error states
- Unsupported questions
- End-to-end demonstration flow

### Verification commands

```bash
cd frontend
npm run build
```

For backend smoke testing, a local request pattern is:

```bash
curl http://localhost:3000/api/orders/NS-1001
curl http://localhost:3000/api/returns/NS-1001
```

## Known limitations

- Stock availability is not part of the MVP scope.
- The app uses sample/demo data rather than live production data.
- Support logic is intentionally lightweight for a one-week MVP.
- No real authentication, payment flow, or production monitoring is included in this demo build.
- The order and return flows are not yet production-hardened for live customer traffic.

## Go-live readiness

A concise go-live note is included in [docs/go-live-readiness.md](docs/go-live-readiness.md). That document summarizes what is working, the known gaps, operational requirements, and the handover needs for the Northstar team.
