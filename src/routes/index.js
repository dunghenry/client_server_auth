const user = require('./user');
const routes = (app) =>{
    app.use('/auth', user);
}

module.exports = routes;