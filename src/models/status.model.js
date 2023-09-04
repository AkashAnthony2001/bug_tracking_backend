const mongoose = require('mongoose')

const statusSchema = mongoose.Schema({
    statusname: {
        type:String,
        required: true
    }
})

const status = mongoose.model('status', statusSchema)

module.exports = status