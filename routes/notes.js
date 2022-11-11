const fs = require('fs');
const uuid = require('../utils/uuid');

const editNote = (updateNoteArr) => {
    fs.writeFile('./db/db.json', JSON.stringify(updateNoteArr), (err) => {
        if (err) throw err;
    })
}

module.exports = (app) => {
    app.get('/api/notes', (req, res) => {
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) throw err;
            res.json(JSON.parse(data));
        });
    });

    app.post('/api/notes', (req, res) => {
        const newNote = req.body;
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) throw err;
            const notesArr = JSON.parse(data);
            newNote.id = uuid({length: 10});
            notesArr.push(newNote);

            editNote(notesArr);
                console.log(
                    `New Note Added!
                    Title: ${JSON.stringify(newNote.title)}
                    Text: ${JSON.stringify(newNote.text)}
                    Date: ${JSON.stringify(newNote.date)}
                    ID: ${newNote.id}`
                );
                res.send(notesArr);
        });
    });

    app.delete('/api/notes/:id', (req, res) => {
        const deleteId = req.params.id;
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) throw err;
            let notesArr = JSON.parse(data);
            for (let i = 0; i < notesArr.length; i++) {
                if (notesArr[i].id === deleteId) {
                    notesArr.splice(i, 1);
                }
            }
            editNote(notesArr);
            console.log(`Note Deleted ID: ${deleteId}`);
            res.send(notesArr);
        });
    });

    app.put('/api/notes/:id', (req, res) => {
        const editId = req.params.id;
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) throw err;
            let notesArr = JSON.parse(data);
            let chosenNote = notesArr.find((note) => note.id === editId);

            if(chosenNote) {
                let updateNote = {
                    title: req.body.title,
                    text: req.body.text,
                    date: req.body.date,
                    id: chosenNote.id
                };
                let targetIndex = notesArr.indexOf(chosenNote);
                notesArr.splice(targetIndex, 1, updateNote);
                res.sendStatus(204);
                editNote(notesArr);
                res.json(notesArr);
            } else {
                res.sendStatus(404);
            }
        });
    });
};