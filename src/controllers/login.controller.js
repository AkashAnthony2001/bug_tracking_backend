const users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getTokenFrom } = require('../utils/helpers');
const {db_info} = require('../config')



const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userData = await users.findOne({ username: username }); 

        if (!userData) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const passwordCorrect = await bcrypt.compare(password, userData.password);

        if (!passwordCorrect) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const userForToken = {
            username: userData.username,
            id: userData.id
        };

        const token = jwt.sign(
            userForToken,
            db_info.secret_key,
            { expiresIn: 60 * 60 * 6 } 
        );

        res.status(200).json({
            token,
            username: userData.username,
            name: userData.name
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

const isAuth = async (req, res) => {
    // Check token
    const token = getTokenFrom(req);

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, db_info.secret_key);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(200).json({ message: 'Authenticated' });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};

module.exports = {
    loginUser,
    isAuth,
};
