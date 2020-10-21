const express = require('express');
const mysql = require("mysql2");
const app = express();
const note = require('./routes/notes.routes');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use(bodyParser.json({ 'type': 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': true }));
app.use('/api/notes', note);
const PORT = process.env.PORT || 3000;


io.on('connection', (socket) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>connected');
  socket.on('ADD', (note) => {
    const addNoteQuery = "INSERT INTO notes (name, active_color, text, text_edit, z_index, width, height, defX, defY, x, y) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    db.query(addNoteQuery,
      [note.name, note.active_color, note.text, note.text_edit, note.z_index,
      note.width, note.height, note.defX, note.defY, note.x, note.y], (err, data) => {
        if (err) { return send(err); }
      });
    socket.broadcast.emit('SET_ADD', note);
  })


  socket.on('CHANGE_DELETE', (note) => {
    const deleteNoteQuery = 'DELETE FROM notes WHERE name=?';

    db.query(deleteNoteQuery, [note.name], (err, data) => {
      if (err) { return send(err); }
    });
    socket.broadcast.emit('SET_CHANGE_DELETE', note);
  })

  socket.on('CHANGE_TEXT', (note) => {
    if(note){
    const indexChangeQuery = "UPDATE notes SET text=? WHERE name=?";

    db.query(indexChangeQuery, [note.text, note.name], (err, data) => {
      if (err) { return send(err); }
    });
    note.textEdit = false;
    note.show = false;
    socket.broadcast.emit('SET_CHANGE_TEXT', note);
  }})

  socket.on('CHANGE_INDEX', (note) => {
    if(note){
      const indexChangeQuery = "UPDATE notes SET z_index=? WHERE name=?";
  
      db.query(indexChangeQuery, [note.z_index, note.name], (err, data) => {
        if (err) { return send(err); }
      });
      socket.broadcast.emit('SET_CHANGE_INDEX', note);
    }
  })

  socket.on('CHANGE_NOTE', (note) => {
    if(note){
      const noteChangeQuery = "UPDATE notes SET name=?, active_color=?, text=?, text_edit=?, z_index=?, width=?, height=?, defX=?, defY=?, x=?, y=? WHERE name=?";

    db.query(noteChangeQuery, [note.name, note.active_color, note.text, note.text_edit, note.z_index,
    note.width, note.height, note.defX, note.defY, note.x, note.y, note.name], (err, data) => {
      if (err) { return send(err); }
    });

    note.textEdit = false;
    note.show = false;
    socket.broadcast.emit('SET_NOTE', note);
  }})
});

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

const db = mysql.createPool({
  connectionLimit : 30,
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b7d5fcc0dab453",
  database: "heroku_834f816ce945ec4",
  password: "fc773d3c"
});

global.db = db;

server.listen(process.env.PORT || 3000);