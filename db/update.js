const util = require('util');
const fs = require('fs');

// Unique ID generator taken from npm : https://www.npmjs.com/package/uuid
const uuid = require('uuid/v1');

// Promise version of fs.readFile/fs.writeFile
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

// Class to read and write additions to the array of notes
class Update {
    read() {
        return readFilePromise('db/db.json', 'utf8');
    }
    write(note) {
        return writeFilePromise('db/db.json', JSON.stringify(note));
    }
    // gathers the notes
    grabNotes() {
        return this.read().then((notes) => {
            let parsedNotes;
            // if notes exist, it is made into an object. If not, it is an empty array
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (error) {
                parsedNotes = [];
            }
            return parsedNotes;
        })
    }


    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("No title or text detected, please provide.");
        }
        const newNote = { title, text, id: uuid() };

        return this.grabNotes()
            .then((notes) => [...notes, newNote])
            .then((updatedNotes) => this.write(updatedNotes))
            .then(() => newNote);
    }
    removeNote(id) {
        return this.grabNotes()
            .then((notes) => notes.filter((note) => note.id !== id))
            .then((sortedNotes) => this.write(sortedNotes));
    }
}

module.exports = new Update();