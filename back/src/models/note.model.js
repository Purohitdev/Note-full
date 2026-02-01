const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema( {

        title: String,
        description: String,

 
        
        
    },
    { timestamps: true }
);

const NoteModel = mongoose.model("Note", notesSchema);

module.exports = NoteModel;
