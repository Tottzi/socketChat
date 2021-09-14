import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const messages: any[] = [
  {
    id: "First",
    messages: [
      {
        name: "Adam",
        message: "input",
        messageId: "bbd378be2a",
        title: "First",
        loginTime: "2021-09-13T12:56:21.288Z",
      },
    ],
  },
  {
    id: "Second",
    messages: [
      {
        name: "Bob",
        message: "second",
        messageId: "bbd378be28",
        title: "Second",
        loginTime: "2021-09-13T12:56:21.288Z",
      },
    ],
  },
];

let title: string = "";

io.on("connection", (socket) => {
  console.log("a user connected");
  // socket.broadcast.emit('hi');
  socket.on("login", (msg: any) => {
    console.log(msg)
    title = msg.title;
  });
  io.emit('Chat session', messages);
  socket.on('Chat session', (msg: any) => {
    // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
    let session = messages.findIndex((message) => message.id === msg.title);
    if(session === -1){
      messages.push({
        id: msg.title,
        messages: [{
          ...msg.newMessage
        }]
      });
    } else {
      messages[session].messages.push(msg.newMessage)
    }
    io.emit('Chat session', messages);
  });
  socket.on("disconnect", (msg) => {
    console.log('Title: ', title)
    // messages.push({ name: "name", message: "disconnected" });
    io.emit("chat message", messages);
    console.log("user disconnected");
  });
});

server.listen(3009, () => {
  console.log("listening on *:3009");
});
