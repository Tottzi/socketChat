"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const messages = [
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
    socket.on('chat message', (msg) => {
        // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
        messages.push(msg);
        io.emit('chat message', messages);
    });
    socket.on('disconnect', () => {
        messages.push({ name: 'name', message: 'disconnected' });
        io.emit('chat message', messages);
        console.log('user disconnected');
    });
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
