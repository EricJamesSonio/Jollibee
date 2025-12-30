🐝 Jollibee POS System — Microservices Documentation
1️⃣ Overview

This project simulates a KIOS and Cashier POS system using:

Microservices: independent services with their own database (SQLite)

Event-driven architecture: Kafka producers/consumers for communication

API Gateway: NGINX routes all client requests

Client: SPA (Vite + vanilla JS)

2️⃣ Services Architecture
Client (KIOS / Cashier SPA)
        |
        | HTTP
        v
API Gateway (NGINX)
        |
        v
+-----------------+    +----------------+    +----------------+    +-----------------+    +----------------+
| Menu Service    |    | Cart Service   |    | Order Service  |    | Payment Service  |    | Auth Service   |
|-----------------|    |----------------|    |----------------|    |-----------------|    |----------------|
| DB: menu.sqlite |    | DB: cart.sqlite|    | DB: order.sqlite|   | DB: payment.sqlite|   | DB: auth.sqlite|
| Provides menu   |    | Handles cart   |    | Tracks orders  |    | Processes payment|    | Cashier login |
| categories/items|    | items, totals  |    | status         |    | Computes change  |    | JWT/session    |
+-----------------+    +----------------+    +----------------+    +-----------------+    +----------------+
        |                       |                       |                       |                  
        |                       |                       |                       |
        |                       |                       |                       |
        |                       +----------------------->+-----------------------+
        |                                                       |
        |                                                       |
        +------------------------------------------------------>+

3️⃣ Services Details
1. Menu Service

Responsibility:

Display menu categories and items

Provide prices for each item

Database: menu.sqlite

Tables:

categories (id, code, name)

menu_items (id, name, price, category_code)

Endpoints:

GET /api/categories
GET /api/menu-items?category=<category_code>


Kafka: None (read-only)

Notes:

Fully self-contained

Can scale horizontally

Serves as data source for Cart Service

2. Cart Service

Responsibility:

Manage customer KIOS cart

Calculate subtotal and total

Send cart to Order Service on checkout

Database: cart.sqlite

Tables:

cart_items (id, menu_item_id, quantity, price)

Endpoints:

POST /api/cart/add       -> add item to cart
GET /api/cart            -> get current cart items + total
DELETE /api/cart/item/:id -> remove item from cart
POST /api/cart/checkout   -> send CART_CHECKOUT event


Kafka Events:

Produces: CART_CHECKOUT → consumed by Order Service

Notes:

All data persisted in SQLite (cart_items)

Avoids in-memory storage to maintain consistency

Decouples checkout from Order Service via Kafka

3. Order Service

Responsibility:

Manage customer orders

Track order status (PENDING, PAID, COMPLETED)

Database: order.sqlite

Tables:

orders (id, status, total, created_at)

order_items (order_id, menu_item_id, quantity, price)

Endpoints:

GET /api/orders/pending
PUT /api/orders/:id/complete


Kafka Events:

Consumes: CART_CHECKOUT → create new order

Produces: ORDER_CREATED → consumed by Payment Service

Notes:

Event-driven: does not call Cart Service directly

Can scale independently

Maintains all order-related data in SQLite

4. Payment Service

Responsibility:

Process cashier payments

Compute change

Confirm payment to Order Service

Database: payment.sqlite

Tables:

payments (id, order_id, amount_paid, change, paid_at)

Endpoints:

POST /api/payments/pay


Kafka Events:

Consumes: ORDER_CREATED → ready for payment

Produces: PAYMENT_CONFIRMED → informs Order Service to mark order as PAID

Notes:

All payment data persisted in SQLite

Handles async payment flow via Kafka

No direct API calls to Order Service

5. Auth Service (Cashier / Admin)

Responsibility:

Authenticate cashiers

Return JWT/session token

Database: auth.sqlite

Tables:

users (id, username, password_hash, role)

Endpoints:

POST /api/auth/login


Kafka: None

Notes:

Provides authentication for cashier UI

Optional: emit audit log events if needed

4️⃣ Event Flow (Kafka)
Cart Service          Order Service          Payment Service
-----------           -------------         ---------------
[CART_CHECKOUT] --->  listens ---> creates order
                      [ORDER_CREATED] --->  listens ---> ready for payment
                                           [PAYMENT_CONFIRMED] --->  listens ---> marks order as PAID/COMPLETED


Principles:

Each service owns its database (SQLite)

Services are loosely coupled through Kafka events

Idempotency must be considered in consumers

Can scale services independently

5️⃣ Best Practices

Database per service → ensures ownership and independence

Event-driven design → avoid direct API calls between services

Idempotent consumers → safe retries on Kafka events

Error handling → graceful failure inside services

Async communication → improves decoupling and responsiveness

Containerization ready → each service can run independently in Docker