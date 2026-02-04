const express = require('express');
const NoteModel = require('./models/note.model');
const cors = require('cors');
const parth = require('path');


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("./Public"));


// create note
app.post("/api/notes", async (req, res) => {

    const { title, description } = req.body;
    const note = await NoteModel.create({ title, description });

    res.status(201).json({
        message: " created successfully",
        note,
    })

})


// note fetch
app.get("/api/notes", async(req, res) => {

    const notes = await NoteModel.find();
    
    res.status(200).json({
        message: "Notes fetched successfully",
        notes,
    })

})


// delete note
app.delete("/api/notes/:id", async (req, res) => {

    const id = req.params.id;
    await NoteModel.findByIdAndDelete(id);
    
    res.status(200).json({
        message: "Note deleted successfully",
    
    })
})

//edit
app.patch("/api/notes/:id", async (req, res) => {

    const id = req.params.id;
    const {description} = req.body;

    await NoteModel.findByIdAndUpdate(id, {description});

    res.status(200).json({
        message: "Note updated successfully",
    })
})

// wildcard route
app.use('*name', (req, res) => {

    res.sendFile(parth.join(__dirname, ".." , "/public/index.html"));
    
})



module.exports = app;
