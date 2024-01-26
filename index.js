const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;
const publicDirectoryPath = path.join(__dirname, "/public");

app.use(express.static(publicDirectoryPath));

let users = {};

io.on("connection", (socket) => {
    console.log('New websocket connection');

    socket.on('join', ({ nickname, color }) => {
        users[socket.id] = { nickname, color };
        socket.broadcast.emit('message', { user: 'Admin', text: `${nickname} has joined the chat` });
        io.emit('userList', Object.values(users));
    });

    socket.on('sendMessage', (message) => {
        io.emit('message', { user: users[socket.id], text: message, time: new Date().toISOString() });
    });

    socket.on('disconnect', () => {
        const nickname = users[socket.id] ? users[socket.id].nickname : 'Unknown User';
        delete users[socket.id];
        socket.broadcast.emit('message', { user: 'Admin', text: `${nickname} has left the chat` });
        io.emit('userList', Object.values(users));
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});
