const express = require('express')
const app = express();
const path = require('path');
const movieRoutes = require('./movies');

const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/movies', movieRoutes)

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});