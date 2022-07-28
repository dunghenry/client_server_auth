const User = require('../models/User');
const userValidation = require('../helpers/validateUser');
const logEvents = require('../helpers/logEvents');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class authController {
    static async register(req, res) {
        const { email } = req.body;
        const { error, value } = userValidation(req.body);
        if (error) {
            return res.status(400).json("Invalid username, password or email!");
        }
        if (!email) {
            return res.status(400).json("Missing is email!");
        }
        else if (!req.body.password) {
            return res.status(400).json("Missing is password!");
        }
        try {
            return res.status(200).json("Register");
        } catch (error) {
            console.log(error);
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
}

module.exports = authController;