import { fetchPendingOrders } from "./services/orders.js";

const ordersContainer = document.getElementById("orders-container");
const orderModal = document.getElementById("order-modal");
const modalClose = document.getElementById("order-modal-close");
const modalOrderId = document.getElementById("modal-order-id");
const modalItems = document.getElementById("modal-items");
const modalTotal = document.getElementById("modal-total");
const amountPaidInput = document.getElementById("amount-paid");
const payBtn = document.getElementById("pay-btn");

let currentOrder = null;

async function loadOrders() {
  const orders = await fetchPendingOrders();
  ordersContainer.innerHTML = "";

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <h3>Order #${order.id} - ${order.status}</h3>
      <p>Total: ₱${order.total.toFixed(2)}</p>
      <p>Created: ${new Date(order.created_at).toLocaleTimeString()}</p>
    `;

    card.onclick = () => showOrderDetails(order);
    ordersContainer.appendChild(card);
  });
}

function showOrderDetails(order) {
  currentOrder = order;
  modalOrderId.textContent = order.id;
  modalItems.innerHTML = "";

  if (order.items && order.items.length) {
    order.items.forEach(item => {
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.marginBottom = "0.5rem";

      div.innerHTML = `
        <img src="http://localhost/images${item.image_url}" />
        <div>
          <p>${item.name} x${item.quantity}</p>
          <p>₱${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
      modalItems.appendChild(div);
    });
  }

  modalTotal.textContent = `Total: ₱${order.total.toFixed(2)}`;
  amountPaidInput.value = order.total.toFixed(2);

  orderModal.classList.remove("hidden");
}

modalClose.onclick = () => orderModal.classList.add("hidden");

// initial load
loadOrders();
setInterval(loadOrders, 5000); // refresh every 5s
