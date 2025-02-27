const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname)));

// Функция для чтения данных из файла
async function readData() {
    const data = await fs.readFile('data.json', 'utf8');
    return JSON.parse(data);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/products', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при чтении данных' });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при чтении данных' });
    }
});

app.listen(PORT, () => {
    console.log(`Shop server is running on http://localhost:${PORT}`);
});
