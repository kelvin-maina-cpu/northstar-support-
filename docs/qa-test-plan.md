# QA Test Plan — Northstar Support Deflection MVP

## Objective

Verify the MVP can demonstrate the primary support flows for:

- Order status
- Returns and refunds

The QA task focuses on real user journeys, validation behavior, and deployment readiness rather than creating a new system architecture.

## Primary user flows

### Flow 1 — Order status

1. Customer opens the support interface.
2. Customer requests order status.
3. Customer provides an order ID.
4. System retrieves the order.
5. System returns useful status information.

### Flow 2 — Returns / refunds

1. Customer requests return/refund help.
2. Customer provides required information.
3. System checks relevant data and rules.
4. System provides an appropriate response.

## Test categories

The following categories should be exercised:

- Valid inputs
- Invalid inputs
- Missing inputs
- Non-existent order IDs
- API errors
- Database errors
- Loading states
- UI errors
- Unsupported questions
- End-to-end workflows

## Test cases

### Order status

| Scenario | Input | Expected result |
| --- | --- | --- |
| Valid order number | `NS12345` | Order details display with a valid status timeline |
| Another valid order number | `NS10000` | Delivered state appears correctly |
| Pending processing order | `NS20000` | Processing state shows without errors |
| Missing input | empty value | Validation error appears |
| Invalid format | `ABC123` | Validation error appears and no lookup is attempted |
| Non-existent order ID | `NS99999` | Not-found/error messaging appears |
| Loading state | valid request | Spinner or loading indicator appears while lookup is in progress |

### Returns and refunds

| Scenario | Input | Expected result |
| --- | --- | --- |
| Valid return request | order number + reason | Submission succeeds and success message appears |
| Missing order number | empty order number | Validation error displayed |
| Missing reason | empty reason | Validation error displayed |
| Invalid request format | malformed input | Error handling stays user-friendly |
| Unsupported question | unrelated support topic | Default guidance or support fallback appears |

## Bug reporting format

Record any issue using the following fields:

- Bug title
- Steps to reproduce
- Expected result
- Actual result
- Severity
- Relevant screenshot/log if available
- Developer responsible
- Verification status

## Functional validation checklist

- Main user flows have been tested
- Important defects have been documented
- Fixed defects have been retested
- The MVP can be demonstrated end-to-end
- Deployment checks have been reviewed
- README documentation is complete
- Go-live readiness note is complete

## Deployment verification

Before deployment, verify:

- Environment variables are set
- Backend URL is correct
- Database connectivity is available
- CORS and configuration are set correctly
- Build process succeeds
- Application startup succeeds
- Main user flows still work in the deployed environment

## Exit criteria

The QA task is complete when the primary user flows are working, critical issues are logged, defects are retested, and the project documentation is ready for handoff.
