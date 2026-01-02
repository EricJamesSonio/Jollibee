import { addToCart } from "../services/cart.js";
import { refreshCartSummary } from "./cart-summary.js";

const modal = document.getElementById("cart-modal");
const nameEl = document.getElementById("modal-name");
const priceEl = document.getElementById("modal-price");
const qtyValue = document.getElementById("qty-value");

const closeBtn = document.getElementById("modal-close");
const minusBtn = document.getElementById("qty-minus");
const plusBtn = document.getElementById("qty-plus");
const addBtn = document.getElementById("add-to-cart-btn");

let currentItem = null;
let quantity = 1;

export function openCartModal(item) {
  currentItem = item;
  quantity = 1;

  nameEl.textContent = item.name;
  priceEl.textContent = `₱${item.price.toFixed(2)}`;
  qtyValue.textContent = quantity;

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

minusBtn.onclick = () => {
  if (quantity > 1) {
    quantity--;
    qtyValue.textContent = quantity;
  }
};

plusBtn.onclick = () => {
  quantity++;
  qtyValue.textContent = quantity;
};

addBtn.onclick = async () => {
  try {
    await addToCart({
      menu_item_id: currentItem.id,
      name: currentItem.name,
      price: currentItem.price,
      quantity,
    });

    // ✅ Refresh cart summary after add
    await refreshCartSummary();

    closeModal();
  } catch (err) {
    alert("Failed to add to cart");
    console.error(err);
  }
};

closeBtn.onclick = closeModal;

modal.onclick = (e) => {
  if (e.target === modal) closeModal();
};
