const bcrypt = require('bcrypt');
const users = require('../models/users.model');
const issueTracker = require('../models/issuetracker.model')

const createUser = async (req, res) => {
    try {
        const { username, name, password, role , isAdmin = false } = req.body;

        const existingUser = await users.findOne({ username: username }); 

        if (existingUser) {
            return res.status(400).json({
                message: "Username Already Exist",
                status:400,
                error:true,
                response:[]
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

const editUsers = async(req,res) => {
    const id = req.params.id
    const { username , name , role  } = req.body
    const updatingData = {
        username:username,
        name:name,
        role:role
    }
    try {
        const updateData = await users.findByIdAndUpdate(id,updatingData,{new:true})
        res.status(200).json({message:"Updated Successfully", status:200, error:false , response:updateData})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while updating user" });
    }
}

const deleteUser = async (req,res) => {
    const id = req.params.id
    try {
        const issueTrackerData = await issueTracker.findOne({ assignedTo: id });

        if (issueTrackerData) {
            res.status(405).json({ message: "Cannot delete User assigned to a project", status: 405, error: true });
        } else {
            await users.findByIdAndDelete(id);
            res.status(200).json({ message: "User Deleted", status: 200, error: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while deleteing user" });
    }
}

module.exports = { createUser, getUser , getAllUsers , deleteUser, editUsers};
