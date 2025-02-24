const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;
app.use(express.static(path.join(__dirname)));

// Тестовые данные
const products = [
    {
        id: 1,
        name: "Ноутбук HP",
        price: 49999,
        description: "Мощный ноутбук для работы",
        categoryIds: [1]
    },
    {
        id: 2,
        name: "Смартфон Samsung",
        price: 29999,
        description: "Современный смартфон",
        categoryIds: [1, 2]
    },
    {
        id: 3,
        name: "Наушники Sony",
        price: 7999,
        description: "Беспроводные наушники",
        categoryIds: [1]
    },
    {
        id: 4,
        name: "Чехол для смартфона",
        price: 999,
        description: "Защитный чехол",
        categoryIds: [2]
    },
    {
        id: 5,
        name: "Зарядное устройство",
        price: 1499,
        description: "Быстрая зарядка",
        categoryIds: [2]
    }
];

const categories = [
    {
        id: 1,
        name: "Электроника"
    },
    {
        id: 2,
        name: "Аксессуары"
    }
];


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/categories', (req, res) => {
    res.json(categories);
});

app.listen(PORT, () => {
    console.log(`Shop server is running on http://localhost:${PORT}`);
});
