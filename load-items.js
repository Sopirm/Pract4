const API_URL = 'http://localhost:8080';
let allProducts = [];
let allCategories = [];
let selectedCategoryIds = [];


let selectedFields = {
    name: true,
    price: true,
    description: true,
    categories: true
};

async function executeGraphQL(query) {
    try {
        const response = await fetch(`${API_URL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        return result.data;
    } catch (error) {
        console.error('Ошибка при выполнении GraphQL запроса:', error);
        throw error;
    }
}


async function loadProducts() {
    try {
        const selectedFieldsQuery = Object.entries(selectedFields)
            .filter(([_, isSelected]) => isSelected)
            .map(([field]) => {
                if (field === 'categories') {
                    return 'categories { name }';
                }
                return field;
            })
            .join('\n                ');

        const query = `{
            productCards {
                ${selectedFieldsQuery}
                categoryIds
            }
        }`;
        
        console.log('GraphQL запрос:', query); 
        
        const data = await executeGraphQL(query);
        allProducts = data.productCards;
        filterProducts();
    } catch (error) {
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
        const query = `{
            categories {
                id
                name
            }
        }`;
        
        const data = await executeGraphQL(query);
        allCategories = data.categories;
        
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
            throw new Error('Контейнер категорий не найден');
        }
        
        categoriesContainer.innerHTML = allCategories.map(category => `
            <label>
                <input type="checkbox" value="${category.id}" class="category-checkbox"> ${category.name}
            </label>
        `).join('');

        // Добавляем обработчики событий для чекбоксов
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedCategories();
                filterProducts();
            });
        });
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
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


 function updateSelectedCategories() {
    selectedCategoryIds = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);
    console.log('Выбранные категории:', selectedCategoryIds);
}

function filterProducts() {
    const filteredProducts = selectedCategoryIds.length === 0 
        ? allProducts 
        : allProducts.filter(product => 
            selectedCategoryIds.every(selectedCategoryId =>
                product.categoryIds.some(productCategoryId => 
                    productCategoryId.toString() === selectedCategoryId
                )
            )
        );
    
    console.log('Отфильтрованные продукты:', filteredProducts);
    displayProducts(filteredProducts);
}

function updateSelectedFields() {
    const checkboxes = document.querySelectorAll('.field-checkbox');
    checkboxes.forEach(checkbox => {
        selectedFields[checkbox.value] = checkbox.checked;
    });
    loadProducts(); 
}

// Отображение продуктов
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => {
        let cardContent = '<div class="product-card">';
        
        if (selectedFields.name) {
            cardContent += `<h3>${product.name}</h3>`;
        }
        if (selectedFields.price) {
            cardContent += `<p>Цена: ${product.price} ₽</p>`;
        }
        if (selectedFields.description) {
            cardContent += `<p>${product.description}</p>`;
        }
        if (selectedFields.categories && product.categories) {
            cardContent += `<p>Категории: ${product.categories.map(cat => cat.name).join(', ')}</p>`;
        }
        
        cardContent += '</div>';
        return cardContent;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
});