const express = require('express');
const cors = require('cors');
const router = require('./routes/index.js')
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(cors());
app.use(express.json())
app.use(router);

app.listen(PORT, () => {
    console.log('started on port', PORT);
})