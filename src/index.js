const express = require('express');
const app = express();
const router = require('./router/router');


app.use(express.json(), router);


app.listen(3000, () => {
    console.log('Servidor iniciado em localhost:3000.');
});