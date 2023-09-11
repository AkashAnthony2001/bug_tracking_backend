const issueTracker = require('../models/issuetracker.model')
const modules = require('../models/module.model')
const { errorHandler } = require('../utils/middleware')


const getAllModules = async (req, res) => {
    try {
        const modulesData = await modules.find()
        res.json(modulesData)
    }
    catch (error) {
        res.send(error)
    }
}

const createModule = async (req, res) => {
    const { module_name, module_description } = req.body;
    try {
        const createData = new modules({
            module_name: module_name,
            module_description: module_description
        })
        const result = await createData.save()
        res.status(200).json({status:200, message:"Module Successfully Created !", error:false, response:result})

    } catch (error) {
        res.send(error)
    }
}

const updateModule = async (req, res) => {
    const id = req.params.id;
    const { module_name, module_description } = req.body;

    const updatingData = {
        module_name: module_name,
        module_description: module_description
    };

    try {
        const issueTrackerData = await issueTracker.findOne({ moduleId: id });

        if (issueTrackerData) {
            res.status(405).json({ message: "Cannot update module assigned to a user", status:405 , error:true });
        } else {
            const dataUpdate = await modules.findByIdAndUpdate(id, updatingData, { new: true });
            res.status(200).json({message:"Module Editied Successfully", status:200 , error:false, response:dataUpdate});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the module", });
    }
};


const deleteModule = async (req, res) => {
    const id = req.params.id
    try {
        const issueTrackerData = await issueTracker.findOne({ moduleId: id });

        if (issueTrackerData) {
            res.status(405).json({ message: "Cannot delete module assigned to a user" , status:405 , error:true});
        } else {
            await modules.findByIdAndDelete(id);
            res.status(200).json({ message: "Module Deleted Successfully" , status: 200 , error: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the module" });
    }
}

module.exports = { getAllModules, createModule, updateModule, deleteModule }