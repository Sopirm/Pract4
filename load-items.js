const API_URL = 'http://localhost:8080';
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        allProducts = data; // Исправлено: сохраняем непосредственно полученные данные
        displayProducts(data); // Отображаем все продукты
    } catch (error) {
        console.error('Детальная ошибка при загрузке продуктов:', error);
        const productsContainer = document.getElementById('products');
        if (productsContainer) {
            productsContainer.innerHTML = `
                <p class="error">
                    Ошибка при загрузке продуктов: ${error.message}
                    <br>
                    Пожалуйста, проверьте работоспособность сервера
                </p>`;
        }
    }
}


async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            throw new Error('Контейнер категорий не найден');
        }
        categoriesContainer.innerHTML = data.map(category => `
            <label>
                <input type="checkbox" value="${category.id}" class="category-checkbox"> ${category.name}
            </label>
        `).join('');

        // Добавляем обработчики событий для чекбоксов
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });
    } catch (error) {
        console.error('Детальная ошибка при загрузке категорий:', error);
        const categoriesContainer = document.getElementById('categories');
        if (categoriesContainer) {
            categoriesContainer.innerHTML = `
                <p class="error">
                    Ошибка при загрузке категорий: ${error.message}
                    <br>
                    Пожалуйста, проверьте работоспособность сервера
                </p>`;
        }
    }
}

// Добавляем новую функцию для фильтрации
let allProducts = []; // Сохраняем все продукты

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} ₽</p>
            <p>${product.description}</p>
        </div>
    `).join('');
}

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);
    
    console.log('Выбранные категории:', selectedCategories);
    console.log('Все продукты:', allProducts);

    const filteredProducts = selectedCategories.length === 0 
        ? allProducts 
        : allProducts.filter(product => 
            selectedCategories.every(selectedCategoryId =>
                product.categoryIds.some(productCategoryId => 
                    productCategoryId.toString() === selectedCategoryId
                )
            )
        );
    
    console.log('Отфильтрованные продукты:', filteredProducts);
    
    displayProducts(filteredProducts);
}

loadProducts();
loadCategories();