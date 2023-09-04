const status = require('../models/status.model')

const getStatus = async (req, res) => {
    try {
        const statusData = await status.find()
        res.send(statusData)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = {getStatus}