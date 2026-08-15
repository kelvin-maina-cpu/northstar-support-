# Northstar Support Deflection MVP — Go-Live Readiness Note

## What works

The MVP currently demonstrates the two prioritized support categories:

- Order status lookup
- Returns and refunds guidance / return submission flow

The demo includes:

- A customer-facing support interface
- Input validation and error states
- Loading and success states
- A frontend flow for checking status and starting a return
- A backend scaffold exposing order and return endpoints
- Documentation and environment guidance for local setup and deployment checks

## Known broken items or unresolved issues

- Support logic services are not yet fully wired to live business rules; the backend returns placeholders or not-found behavior until implementation is completed.
- The order and return APIs are not production-validated against a live database or external systems.
- The app uses demo/sample data rather than real order data.
- Stock availability is not implemented in the MVP and is explicitly outside the initial scope.
- There is no production deployment configuration, observability, or security hardening in this prototype.

## Limitations

This MVP is intentionally limited to a lightweight demonstration of deflection behavior. It does not currently support:

- Real-time inventory checks
- Real order fulfillment integration
- Real payment processing or refund settlement
- Customer authentication or account-based personalization
- Production-grade logging, alerting, or monitoring
- High-volume customer traffic handling

## Northstar handover requirements

Before handing this to Northstar operations, the team should configure or confirm the following:

- Production MongoDB connection details and environment variables
- Correct API URLs between frontend and backend
- CORS rules for the deployed frontend origin
- Deployment build and startup scripts for the target environment
- Ownership for future support logic and rule updates
- A review of sample data and edge-case handling before live demo use

## Recommendation

This is suitable as an MVP demo and internal validation prototype, but not as a production-ready customer support system without additional backend logic, deployment checks, and operational controls.
