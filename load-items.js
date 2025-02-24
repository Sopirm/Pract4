async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} ₽</p>
            <p>${product.description}</p>
        </div>
    `).join('');
}

async function loadCategories() {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = categories.map(category => `
        <label>
            <input type="checkbox" value="${category.id}"> ${category.name}
        </label>
    `).join('');
}

loadProducts();
loadCategories();