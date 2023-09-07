const bcrypt = require('bcrypt');
const users = require('../models/users.model');

const createUser = async (req, res) => {
    console.log(req.body);
    try {
        const { username, name, password, role , isAdmin = false } = req.body;

        const existingUser = await users.findOne({ username: username }); 

        if (existingUser) {
            return res.status(400).json({
                error: "Username must be unique"
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        
        const newData = new users({
            username: username,
            name: name,
            password: passwordHash,
            role: role,
            isAdmin: role === 'admin' ? true : isAdmin
        });
        await newData.save();
        
        res.status(200).json({ status: true, message: "Success" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred" }); 
    }
};

const getUser = async (req, res) => {
    const username = req.params.username;

    try {
        const userData = await users.findOne({ username }); 
        console.log(userData);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" }); 
    }
};

const getAllUsers = async (req,res) => {
    try {
        const userDetails = await users.find()
        res.send(userDetails)
    } catch (error) {
        res.send(error)
    }
}

const deleteUser = async (req,res) => {
    const id = req.params.id
    try {
        await users.findByIdAndDelete(id)
        res.status(200).json({ message: "Success", status: 200, error: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while deleteing user" });
    }
}

module.exports = { createUser, getUser , getAllUsers , deleteUser};
