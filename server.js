const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const PORT = 3000;

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger документация
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API для управления задачами',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['openapi.yaml'], // укажите путь к файлам с аннотациями
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Middleware для парсинга JSON
app.use(bodyParser.json());


// Изменяем структуру хранения данных
let products = [];
let categories = [];

// Получить список всех товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// Получить список категорий
app.get('/categories', (req, res) => {
    res.json(categories);
});

// Создать новый товар
app.post('/products', (req, res) => {
    const { name, price, description, categoryIds } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
        categoryIds: categoryIds || []
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Создать новую категорию
app.post('/categories', (req, res) => {
    const { name } = req.body;
    const newCategory = {
        id: categories.length + 1,
        name
    };
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

// Получить задачу по ID
app.get('/categories/:id', (req, res) => {
    const categoryId = parseInt(req.params.id);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        res.json(category);
    } else {
        res.status(404).json({ message: 'Category not found' });
    }
});

// Удалить категорию по ID
app.delete('/categories/:id', (req, res) => {
    const categoryId = parseInt(req.params.id);
    categories = categories.filter(c => c.id !== categoryId);
    res.status(204).send();
});

// Получить задачу по ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Обновить товар по ID
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        const { name, price, description, categoryIds } = req.body;
        product.name = name !== undefined ? name : product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description !== undefined ? description : product.description;
        product.categoryIds = categoryIds !== undefined ? categoryIds : product.categoryIds;
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Удалить товар по ID
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    res.status(204).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-shop.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:", PORT);
});