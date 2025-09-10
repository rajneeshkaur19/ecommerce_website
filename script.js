const cartCount = document.getElementById("cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const searchBar = document.getElementById("search-bar");
const products = document.querySelectorAll(".product");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");

let cart = [];

// Add Checkout Button dynamically
const checkoutBtn = document.createElement("button");
checkoutBtn.id = "checkout-button";
checkoutBtn.textContent = "Proceed to Checkout";
document.querySelector(".cart-section").appendChild(checkoutBtn);

// Modal elements
const checkoutModal = document.getElementById("checkout-modal");
const orderItems = document.getElementById("order-items");
const orderTotal = document.getElementById("order-total");
const confirmOrderBtn = document.getElementById("confirm-order");
const closeCheckoutBtn = document.getElementById("close-checkout");

// Update Cart
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="qty-controls">
        <button class="qty-btn decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn increase" data-index="${index}">+</button>
      </div>
      <span>₹${item.price * item.quantity}</span>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `Total: ₹${total}`;

  // Cart Events
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      updateCart();
    });
  });

  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      cart[btn.dataset.index].quantity++;
      updateCart();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      if (cart[index].quantity > 1) cart[index].quantity--;
      else cart.splice(index, 1);
      updateCart();
    });
  });
}

// Add to cart
addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const product = button.parentElement;
    const name = product.dataset.name;
    const price = parseInt(product.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity++;
    else cart.push({ name, price, quantity: 1 });

    updateCart();
  });
});

// Clear cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Search & Filter
function filterProducts() {
  const searchValue = searchBar.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const priceValue = priceFilter.value;

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const price = parseInt(product.dataset.price);

    let matchesSearch = name.includes(searchValue);
    let matchesCategory = categoryValue === "all" || category === categoryValue;
    let matchesPrice = true;

    if (priceValue === "low") matchesPrice = price < 5000;
    else if (priceValue === "mid") matchesPrice = price >= 5000 && price <= 20000;
    else if (priceValue === "high") matchesPrice = price > 20000;

    product.style.display = (matchesSearch && matchesCategory && matchesPrice) ? "block" : "none";
  });
}

searchBar.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) { alert("Cart is empty!"); return; }
  orderItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    orderItems.innerHTML += `<div>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</div>`;
  });
  orderTotal.textContent = `Total: ₹${total}`;
  checkoutModal.style.display = "block";
});

closeCheckoutBtn.addEventListener("click", () => checkoutModal.style.display = "none");

confirmOrderBtn.addEventListener("click", () => {
  alert("Thank you! Your order has been placed.");
  cart = [];
  updateCart();
  checkoutModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target == checkoutModal) checkoutModal.style.display = "none";
});
