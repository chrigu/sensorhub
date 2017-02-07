/**
 * Created by christiancueni on 07/02/17.
 */
import socketio from 'socket.io';

let io;
let sockets = [];

export function startSocket(http) {
    io = socketio(http);
    io.on('connection', onConnect);
}

export function broadcast(data) {
    sockets.map(socket => socket.emit('live', data));
}

function onConnect(socket) {
    sockets.push(socket);
    console.log('a user disconnected', socket.id);
    console.log('a user connected');
}

function onDisconnect(socket) {
    sockets = sockets.filter(s => s.id !== socket.id);
    console.log('a user disconnected', socket);
}

