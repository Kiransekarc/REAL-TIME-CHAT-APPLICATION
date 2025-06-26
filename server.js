const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

let rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join room', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) {
      rooms[room] = [];
    }

    // Send chat history to the user
    socket.emit('chat history', rooms[room]);

    // Notify others
    socket.to(room).emit('chat message', {
      user: 'System',
      text: `${username} has joined the room.`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('chat message', (msg) => {
    const message = {
      user: socket.username,
      text: msg,
      time: new Date().toLocaleTimeString()
    };

    // Save to room history
    rooms[socket.room].push(message);

    io.to(socket.room).emit('chat message', message);
  });

  socket.on('typing', (isTyping) => {
    socket.to(socket.room).emit('typing', {
      user: socket.username,
      isTyping
    });
  });

  socket.on('disconnect', () => {
    if (socket.username && socket.room) {
      socket.to(socket.room).emit('chat message', {
        user: 'System',
        text: `${socket.username} left the room.`,
        time: new Date().toLocaleTimeString()
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
