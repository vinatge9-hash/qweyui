// Shared helpers for all pages

// The actual rendering functions are in data.js and are wired up on each page via inline scripts.
// This file exists to ensure all pages can access addToCartFromUI, renderCategory, and renderCart.

// Re-export functions in global scope if needed (some browsers may require window)
if (typeof window.addToCartFromUI !== 'function') {
  window.addToCartFromUI = function(p) {
    // Fallback: if data.js not loaded yet, ignore
  };
}

console.log('Niyantri: scripts loaded.');
