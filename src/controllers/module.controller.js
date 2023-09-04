const modules = require('../models/module.model')


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
            module_name:module_name,
            module_description:module_description
        })
        const result = await createData.save()
        res.send(result)

    } catch (error) {
        res.send(error)
    }
}

const updateModule = async (req,res) => {
    const id = req.params.id;
    const { module_name , module_description } = req.body

    const updatingData = {
        module_name : module_name,
        module_description : module_description
    }

    try{
        const dataUpdate = await modules.findByIdAndUpdate(id,updatingData,{new:true})
        res.json(dataUpdate)
    }
    catch(error){
        res.send(error)
    }
}

const deleteModule = async (req,res) => {
    const id = req.params.id
    try{
        await modules.findByIdAndDelete(id)
        res.status(204).end()
    }
    catch(error){
        res.send(error)
    }
}

module.exports = { getAllModules , createModule , updateModule , deleteModule }