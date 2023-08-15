require('dotenv').config();
const express = require('express');
const router = require('./router/index.js');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.static('./static'))
app.use('/api', router);


function start() {
    try {
        app.listen(PORT, () => console.log('Server started on port', PORT));
    } catch (e) {
        throw new Error('ошибка')
    }
}

start();