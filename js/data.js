// Mock product data for categories
const MOCK_PRODUCTS = {
  electronics: [
    { id: 'e1', name: 'Smartphone XYZ', price: 299, image: 'https://images.unsplash.com/photo-1572016047668-5b5e909e1605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODkyNDZ8MHwxfHNlYXJjaHw2fHxzbWFydHBob25lfGVufDB8MHx8fDE3NTY0NjYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Feature-rich smartphone.' },
    { id: 'e2', name: 'Wireless Headphones', price: 99, image: 'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Noise-cancelling headphones.' },
    { id: 'e3', name: 'Smartwatch Pro', price: 199, image: 'https://images.unsplash.com/photo-1617625802912-cde586faf331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODkyNDZ8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNofGVufDB8MHx8fDE3NTY0NjYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Fitness tracking and more.' }
  ],
  'home-products': [
    { id: 'h1', name: 'Blender Pro', price: 49, image: 'https://images.unsplash.com/photo-1681392841332-63de1b3fce46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODkyNDZ8MHwxfHNlYXJjaHw3fHxibGVuZGVyfGVufDB8MHx8fDE3NTY0NjYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Powerful kitchen blender.' },
    { id: 'h2', name: 'Air Purifier', price: 89, image: 'https://pixabay.com/get/g8422e53fa51b143173d79a79b3259e623d07f6904cf6c304b27243f5ce9afaf4d144b472692d6a436dfd43f4c241542569c4c6eeb24667552770dc3aeac88472_640.jpg', description: 'Clean air at home.' },
    { id: 'h3', name: 'Robot Vacuum', price: 129, image: 'https://images.pexels.com/photos/4112723/pexels-photo-4112723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Automatic floor cleaning.' }
  ],
  clothes: [
    { id: 'c1', name: 'Classic Tee', price: 19, image: 'https://pixabay.com/get/g4dd766bc3d4aded8540fe1bec3c960c1d908a2f990739365252a7d3c81f71faba44537bf6212aaeedecac0e68cc484763c18138dab2e6cacf1fa9cbdae20dc86_640.jpg', description: 'Soft cotton tee.' },
    { id: 'c2', name: 'Denim Jeans', price: 39, image: 'https://images.pexels.com/photos/2129970/pexels-photo-2129970.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Comfort fit jeans.' },
    { id: 'c3', name: 'Hoodie', price: 49, image: 'https://pixabay.com/get/gd65741a073128c9a07f3b0bfc5002621a63c0d8cbc97c1fdeab9b378342fe84c29e302a30a6cf60a0f7bccf3fb3757a3db4e3e721ba6ed0b374518e738203918_640.jpg', description: 'Cozy and warm.' }
  ]
};

function fetchProducts(category) {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS[category] || []);
    }, 150);
  });
}

// Cart utilities
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((a, b) => a + (b.quantity || 1), 0);
  const el = document.getElementById('cart-count-top');
  if (el) el.textContent = count;
  const elTop = document.getElementById('cart-count-top');
  if (elTop) elTop.textContent = count;
}

// Global addToCart exposed for HTML pages
function addToCartFromUI(product) {
  addToCart(product);
  updateCartCount();
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, description: product.description });
  }
  saveCart(cart);
}

// Rendering helper for category pages
function renderCategory(category, container) {
  if (!container) return;
  container.innerHTML = '<p class="text-sm text-gray-600">Loading products...</p>';
  fetchProducts(category).then((items) => {
    container.innerHTML = '';
    if (!items.length) {
      container.innerHTML = '<p class="text-sm text-gray-600">No products found in this category.</p>';
      return;
    }
    items.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow overflow-hidden';
      card.innerHTML = `
        <div class="h-48 w-full overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-1">${p.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${p.description}</p>
          <div class="flex items-center justify-between">
            <span class="font-semibold">$${p.price}</span>
            <button onclick='addToCartFromUI(${JSON.stringify(p)})' class="bg-primary text-white px-3 py-2 rounded hover:bg-indigo-600">Add to Cart</button>
          </div>
        </div>`;
      container.appendChild(card);
    });
  });
}

// Cart rendering for cart.html
function renderCart() {
  const container = document.getElementById('cart-container');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();
  if (!container) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-600">Your cart is empty. Add items from any category.</p>';
    totalEl.textContent = '0.00';
    // Clear PayPal container
    const paypal = document.getElementById('paypal-button-container');
    if (paypal) paypal.innerHTML = '';
    return;
  }
  let total = 0;
  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between bg-white rounded-lg shadow p-4';
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;
    row.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="h-16 w-16 object-cover rounded" />
        <div>
          <div class="font-semibold">${item.name}</div>
          <div class="text-sm text-gray-600">${item.description || ''}</div>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="font-semibold">$${item.price}</span>
        <input type="number" min="1" value="${item.quantity || 1}" class="w-16 border rounded px-2 py-1" onchange="updateQuantity('${item.id}', this.value)" />
        <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:underline">Remove</button>
      </div>`;
    container.appendChild(row);
  });
  totalEl.textContent = total.toFixed(2);
  // Render PayPal button with current total
  renderPayPal(total);
}

function updateQuantity(id, value) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    const q = Math.max(1, parseInt(value || '1', 10));
    item.quantity = q;
    saveCart(cart);
    renderCart();
  }
}
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function renderPayPal(total) {
  const paypalContainer = document.getElementById('paypal-button-container');
  if (!paypalContainer) return;
  paypalContainer.innerHTML = '';
  if (!total || total <= 0) return;
  // Ensure PayPal script runs
  if (typeof paypalButtonsLoaded === 'undefined' || !paypalButtonsLoaded) {
    paypalButtonsLoaded = true;
  }
  // Create order
  window.paypalButtons && window.paypalButtons.close && window.paypalButtons.close();
  // Use PayPal Buttons API
  // Note: We assume PayPal script is loaded
  if (typeof paypal !== 'undefined' && paypal.Buttons) {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{ amount: { value: total.toFixed(2) } }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          // Simple success message and clear cart
          localStorage.removeItem('cart');
          renderCart();
          alert('Payment successful! Transaction: ' + details.id);
        });
      }
    }).render('#paypal-button-container');
  }
}

// Expose helper for cart page
window.renderCart = renderCart;
window.updateCartCount = updateCartCount;
