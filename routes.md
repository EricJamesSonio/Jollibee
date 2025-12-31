# Jollibee Kiosk - Service Routes

This document lists all **public HTTP endpoints** exposed by the microservices. The API Gateway will aggregate these routes and provide a unified interface for the client (kiosk).

---

## 1. Menu Service

| Method | Route           | Query / Body         | Description                        |
|--------|----------------|--------------------|------------------------------------|
| GET    | `/categories`   | none               | Get all menu categories            |
| GET    | `/menu-items`   | `category` (query) | Get all menu items in a category   |

---

## 2. Cart Service

| Method | Route               | Query / Body         | Description                                |
|--------|-------------------|--------------------|--------------------------------------------|
| POST   | `/cart/add`        | item object         | Add an item to the cart                    |
| GET    | `/cart`            | none               | Get current cart with items and total      |
| DELETE | `/cart/item/:id`   | path param `id`     | Remove an item from the cart               |
| POST   | `/cart/checkout`   | none               | Checkout cart → emits `CART_CHECKOUT` event|

**Cart Item Object Example (POST /cart/add):**
```json
{
  "menu_item_id": 1,
  "name": "Burger",
  "price": 120,
  "quantity": 2
}
3. Order Service
Method	Route	Query / Body	Description
GET	/orders/pending	none	Get all pending or paid orders
PUT	/orders/:id/complete	path param id	Mark a specific order as completed

4. Payment Service
Method	Route	Query / Body	Description
POST	/payments/pay	{ order_id: number, amount_paid: number }	Process payment for an order → emits PAYMENT_CONFIRMED

5. Notes for API Gateway
All client requests should go through the API Gateway.

API Gateway will route requests to:

/menu/* → Menu Service

/cart/* → Cart Service

/orders/* → Order Service

/payments/* → Payment Service

Kafka events are handled internally by services; client only interacts via HTTP endpoints.

Example checkout flow:

Client adds items via /cart/add.

Client views cart via /cart.

Client calls /cart/checkout → triggers order creation.

Payment is made via /payments/pay.

Order status updates (PAID → COMPLETED) can be fetched via /orders/pending.

