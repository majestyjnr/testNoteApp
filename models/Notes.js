const mongoose = require('mongoose')

const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    note:{
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    }
}, {timestamps: true})

const Notes = mongoose.model('note', NotesSchema)
module.exports = Notes