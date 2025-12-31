# Jollibee Kiosk System - Event Flow Documentation

This document explains the **flow of events** across the microservices in the Jollibee kiosk system. The system is fully **event-driven** using Kafka and backed by SQLite databases.

---

## 1. Menu Service
- **Purpose:** Provides menu categories and items.
- **Database:** `menu.sqlite` with tables:
  - `categories`
  - `menu_items`
- **Repository Functions:**
  - `getCategories()` → returns all categories
  - `getMenuByCategory(categoryCode)` → returns items for a category
- **Kafka:** None
- **Flow:** User browses the menu on the kiosk.

---

## 2. Cart Service
- **Purpose:** Manage cart items, calculate total, and trigger checkout.
- **Database:** `cart.sqlite` with table:
  - `cart_items`
- **Repository Functions:**
  - `addItem(item)` → add menu item to cart
  - `getItems()` → retrieve current cart items
  - `removeItem(id)` → remove item from cart
  - `clearCart()` → empty cart after checkout
- **Service Functions:**
  - `addItem(item)`, `getCart()`, `removeItem(id)`, `checkout()`
- **Kafka:**
  - **Producer:** emits `CART_CHECKOUT` event on `checkout()`
- **Flow:**
  1. User adds items to cart.
  2. On checkout, cart is sent to Kafka (`CART_CHECKOUT`) and cart cleared.

---

## 3. Order Service
- **Purpose:** Create orders from cart, update status, and handle payments.
- **Database:** `order.sqlite` with tables:
  - `orders` → tracks order status (`PENDING`, `PAID`, `COMPLETED`)
  - `order_items` → tracks individual items per order
- **Repository Functions:**
  - `createOrder(order)` → inserts order and items
  - `getPendingOrders()` → list pending or paid orders
  - `markOrderPaid(orderId)` → set status to `PAID`
  - `markOrderComplete(orderId)` → set status to `COMPLETED`
- **Service Functions:**
  - `createOrderFromCart(cart)` → triggered by `CART_CHECKOUT` event
  - `handlePaymentConfirmed(event)` → triggered by `PAYMENT_CONFIRMED`
- **Kafka:**
  - **Consumer:** listens to `CART_CHECKOUT` and `PAYMENT_CONFIRMED`
  - **Producer:** emits `ORDER_CREATED` after creating order
- **Flow:**
  1. Receives `CART_CHECKOUT` → creates `PENDING` order → emits `ORDER_CREATED`.
  2. Receives `PAYMENT_CONFIRMED` → marks order as `PAID`.

---

## 4. Payment Service
- **Purpose:** Handle payment processing for orders.
- **Database:** `payment.sqlite` with tables:
  - `payments` → stores payment records
  - `pending_orders` → keeps track of unpaid orders
- **Repository Functions:**
  - `savePendingOrder(order)` → store order until paid
  - `getPendingOrder(orderId)` → fetch pending order
  - `deletePendingOrder(orderId)` → remove after payment
  - `savePayment(payment)` → store payment record
- **Service Functions:**
  - `cacheOrder(order)` → called when `ORDER_CREATED` is received
  - `processPayment(orderId, amountPaid)` → handle payment and emit confirmation
- **Kafka:**
  - **Consumer:** listens to `ORDER_CREATED`
  - **Producer:** emits `PAYMENT_CONFIRMED` after successful payment
- **Flow:**
  1. Receives `ORDER_CREATED` → saves order in `pending_orders`.
  2. Payment API called → verifies amount → stores payment → emits `PAYMENT_CONFIRMED` → deletes from pending.

---

## 5. Event Flow Summary

```mermaid
flowchart LR
    A[Menu Service] -->|User selects items| B[Cart Service]
    B -->|Checkout emits CART_CHECKOUT| C[Order Service]
    C -->|Create order emits ORDER_CREATED| D[Payment Service]
    D -->|Payment confirmed emits PAYMENT_CONFIRMED| C
    C -->|Order marked PAID| E[Order Complete]
