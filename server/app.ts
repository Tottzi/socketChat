import express from "express";
import http from "http";
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const messages: any[] = [
  {
    name: 'Adam',
    message: 'First message'
  },
  {
    name: 'Bob',
    message: 'Second message'
  }
];

io.on('connection', (socket) => {
  io.emit('chat message', messages);
  console.log('a user connected');
  // socket.broadcast.emit('hi');
  socket.on('chat message', (msg: any) => {
    // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
    messages.push(msg)
    io.emit('chat message', messages);
  });
  socket.on('disconnect', () => {
    messages.push({name: 'name', message: 'disconnected'})
    io.emit('chat message', messages);
    console.log('user disconnected');
  });
});


server.listen(3000, () => {
  console.log('listening on *:3009');
});