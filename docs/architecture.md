# Northstar Support Deflection MVP

## 1. Project Objective

Northstar Retail Co. is a mid-size e-commerce company whose support team receives repetitive customer questions.

The MVP will reduce manual support handling by providing self-service responses for:

1. Order Status
2. Returns & Refunds

Stock Availability is outside the initial MVP scope and may be considered as a stretch feature if time permits.

## 2. MVP Scope

### Included

* Customer support interface
* Order status lookup
* Returns/refund assistance
* Backend API
* Database
* Support/business rules
* Error handling
* Testing
* Deployment
* Documentation

### Not Included in Initial MVP

* Full production e-commerce functionality
* Real payment processing
* Real customer data
* Advanced AI infrastructure
* Stock availability unless the core MVP is already complete

## 3. Proposed Technology Stack

### Frontend

React + Vite

### Backend

Node.js + Express

### Database

MongoDB

### Version Control

Git + GitHub

### Deployment

To be confirmed by the team during implementation.

## 4. High-Level Architecture

```text
Customer
   |
   v
React Frontend
   |
   | REST API
   v
Node.js + Express
   |
   +--------------------+
   |                    |
   v                    v
Support Logic       MongoDB
   |                    |
   +---------+----------+
             |
             v
        Response
             |
             v
      React Frontend
             |
             v
          Customer
```

## 5. Main Components

### Frontend

Responsible for:

* Support interface
* Order status interface
* Returns/refund interface
* Input validation
* Loading states
* Error states
* Displaying API responses

### Backend

Responsible for:

* REST API
* Request validation
* Business logic integration
* Database access
* Error handling

### Support Logic

Responsible for:

* Understanding supported support scenarios
* Order status rules
* Return eligibility rules
* Refund status rules
* Unsupported-question fallback

### Database

Primary data areas:

* Customers
* Orders
* Returns/Refunds

Sample fictional data will be used for the MVP demonstration.

## 6. API Contracts

### Order Status

Endpoint:

`GET /api/orders/:orderId`

Example response:

```json
{
  "orderId": "NS-1001",
  "status": "Shipped",
  "shipmentStatus": "In Transit",
  "expectedDelivery": "2026-08-18"
}
```

### Returns / Refunds

Endpoint:

`GET /api/returns/:orderId`

Example response:

```json
{
  "orderId": "NS-1001",
  "eligible": true,
  "returnStatus": "Not Requested",
  "refundStatus": null
}
```

These API contracts are provisional and must be agreed upon by the team before implementation.

## 7. Team Responsibilities

| Role                        | Responsibility                                 |
| --------------------------- | ---------------------------------------------- |
| Team Lead / Backend         | Backend, API, integration, GitHub coordination |
| Frontend Developer          | Customer-facing interface                      |
| Database Developer          | Database schema and sample data                |
| Support Logic Developer     | Business rules and support workflows           |
| QA / DevOps / Documentation | Testing, deployment and documentation          |

## 8. Git Workflow

The `main` branch represents the stable version of the project.

Members work on feature/task branches.

Example:

`feature/order-status-api`

Workflow:

1. Select assigned task.
2. Move task to In Progress.
3. Create feature branch.
4. Implement task.
5. Test changes.
6. Commit changes.
7. Push branch.
8. Open Pull Request.
9. Receive review.
10. Merge into `main`.
11. Move task to Done.

## 9. Commit Convention

All commits must follow:

`<type>: <what changed> - <why it matters>`

Example:

`feat: add order status endpoint - enables customers to track orders`

Avoid vague commits such as:

* `update`
* `changes`
* `wip`
* `final`

## 10. Definition of Done

A task is considered complete only when:

* The requested functionality is implemented.
* The implementation has been tested.
* Existing functionality has not been unnecessarily broken.
* Code is committed to the appropriate branch.
* A Pull Request has been created where required.
* The task has been reviewed.
* The task is merged into `main`.
* The GitHub task is moved to Done.

## 11. MVP Priority

The team will prioritize:

1. Working Order Status flow
2. Working Returns/Refund flow
3. Integration
4. Testing
5. Deployment
6. Documentation

Additional functionality will only be developed after the core MVP works end-to-end.
