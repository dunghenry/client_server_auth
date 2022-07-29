const auth = require('./auth');
const routes = (app) =>{
    app.use('/auth', auth);
}

module.exports = routes;