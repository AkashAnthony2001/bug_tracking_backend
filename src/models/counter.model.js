const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    seq:{
        type:Number
    }
})

const counterModel = mongoose.model('counters',counterSchema)

module.exports = counterModel