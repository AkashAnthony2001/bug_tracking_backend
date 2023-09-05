const mongoose = require('mongoose')

const statusSchema = mongoose.Schema({
    bug_id: {
        type:String,
        required: true
    }
})

const status = mongoose.model('status', statusSchema)

module.exports = status