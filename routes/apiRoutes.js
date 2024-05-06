const app = require('express').Router();
const updater = require('../public/assets/js/update');

// take the created class of update and convert to json
app.get('/notes', (req,res) => {
    updater.addNote(req.body)
    .then((note) => {
        res.json(note)
    })
})

// removes note with given id and re-updates the list
app.delete('/notes/:id', (req, res) => {
    updater.removeNote(req.params.id)
    .then((note) => {
        res.json(note)
    })
})
module.exports = app;