const express = require('express');
const { engine } =  require('express-handlebars');
const viewEngine = (app) => {
    app.use(express.static("./src/public"))
    app.engine('.hbs', engine({ extname: '.hbs' }));
    app.set('view engine', '.hbs');
    app.set('views', './src/views');
}
module.exports = viewEngine;