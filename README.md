# Jollibee POS System Simplified

## Overview

Focus of this project:  
- Microservices  
- API Gateway  
- Event-driven architecture  

Simulating the KIOSK machine of Jollibee:  
- Customer uses the kiosk  
- Cashier logs in to see pending orders  
- Cashier inputs payment given by the customer  
- Marks orders as completed  

### Features
- Display Menu Items (Jollibee food items)  
- Category selection:
  - Chickenjoy meals (C1, C2, C3)  
  - Burgers (B1, B2, B3)  
  - Drinks (D1, D2, D3)  
  - Desserts (S1, S2, S3)  
- Choose items then add to cart  
- Cart shows computed total  
- Checkout contains totals  
- Payment is processed by the Cashier account  

---

## Microservices
- Uses `database.sqlite` for simplicity (no need for XAMPP)  
- Module-based structure: each module contains `repository`, `routes`, `controller`, `services`, `dto`, `index.js`  
- `index.js` gathers all module files for injection in `container.js`  
- `container.js` handles dependency injection  
- Middleware for error handling and other utilities  
- `kafka/` folder contains producers and consumers as needed per service  
- `app.js` runs the service  

---

## Client
- Vanilla JS with Vite (SPA structure)  
- Services to connect with API Gateway  

---

## API Gateway
- Nginx as gateway  
- CORS configured so client can connect  

---

## Event-Driven Architecture
- Kafka broker with Zookeeper  
- Configured in Docker (single partition for simplicity)  

---

## Services Needed

### Menu Service
- Display menu items and categories  

**Menu Display:**  
<img src="assets/menu.png" alt="Menu Display" width="400"/>

### Cart Service
- Add to cart  
- Remove from cart  
- Find item in cart  
- Total computation  

**Add to Cart:**  
<img src="assets/addtocart.png" alt="Add to Cart" width="400"/>

**Cart Display:**  
<img src="assets/cart.png" alt="Cart Display" width="400"/>

### Order Service
- Checkout  

---

## Step-by-Step Building as a Solo Developer
1. **Microservices** – Build each service and ensure it works  
2. **API Gateways** – Set up the API gateway before building the client  
3. **Client Side** – Build the client based on backend capabilities  
4. **Kafka** – Create consumer, producer, and broker  

