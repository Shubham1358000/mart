const page = document.body.dataset.page;
const productGrid = document.getElementById("product-grid");
const productDetail = document.getElementById("product-detail");

// Fetch all products for the home page
async function getProducts() {
  const response = await fetch("http://localhost:1358/api/products");
  if (!response.ok) throw new Error("Failed to load product data");
  return response.json();
}

// Fetch a single product by ID for the product detail page
async function getProductById(id) {
  const response = await fetch(`http://localhost:1358/api/products/${id}`);
  if (!response.ok) throw new Error("Product not found");
  return response.json();
}

function renderHome(products) {
  if (!productGrid) return;

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="card-emoji">${product.image}${product.image}</div>
          <h2>${product.productName}</h2>
          <div class="card-details">
            <div>
              <span>Qty</span>
              <strong>${product.quantity}</strong>
            </div>
            <div>
              <span>Price</span>
              <strong>₹${product.price}</strong>
            </div>
          </div>
          <a class="card-link" href="product.html?id=${product.id}">Detail 👉</a>
        </article>
      `
    )
    .join("");
}

// Now accepts a SINGLE product object
function renderProduct(product) {
  if (!productDetail) return;

  if (!product) {
    productDetail.innerHTML = `<div class="empty-state">Product not found.</div>`;
    return;
  }

  productDetail.innerHTML = `
    <div class="product-shell">
      <div class="product-badges">
        <span class="badge ${product.organic ? "" : "hidden"}">Organic</span>
        <a class="back-link" href="index.html">👈</a>
      </div>

      <div class="product-hero">
        ${Array.from({ length: 9 }, (_, index) => `
          <span class="product-emoji product-emoji-${index + 1}">${product.image}</span>
        `).join("")}
      </div>

      <h2 class="product-name">${product.productName}</h2>

      <div class="product-info-grid">
        <div><span>🌍</span> from ${product.from}</div>
        <div><span>😍</span> ${product.nutrients}</div>
        <div><span>📦</span> ${product.quantity}</div>
      </div>

      <a href="#" class="product-button">🛒 Add to shopping card ₹${product.price}</a>
      <p class="product-description">${product.description}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (page === "home") {
      const products = await getProducts();
      renderHome(products);
    }

    if (page === "product") {
      const params = new URLSearchParams(window.location.search);
      const productId = Number(params.get("id"));

      if (!productId && productId !== 0) {
        renderProduct(null);
        return;
      }

      // Calls the backend /api/products/:id endpoint
      const product = await getProductById(productId);
      renderProduct(product);
    }
  } catch (error) {
    console.error("Error loading page data:", error);

    if (productGrid) {
      productGrid.innerHTML = '<p class="empty-state">Unable to load products.</p>';
    }

    if (productDetail) {
      productDetail.innerHTML = '<p class="empty-state">Unable to load product details.</p>';
    }
  }
});