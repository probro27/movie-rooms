import { Server as IOServer, Socket } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import { Server as HTTPServer } from 'http';
import { uuid } from 'uuidv4';

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
};

interface SocketWithIO extends NetSocket {
    server: SocketServer
};

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
};

interface ISocket extends Socket {
    room?: string
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    // It means that socket server was already initialized
    if (res.socket.server.io) {
        console.log('Socket is already running.');
    } else {
        console.log('Socket is initializing...');

        const io = new IOServer(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket: ISocket) => {
            socket.on('start-session', function(data) {
                console.log('===================start-session event=================');
                console.log(data);
                if(data.sessionId == null) {
                    let session_id = uuid();
                    socket.room = session_id;
                    socket.join(socket.room);
                    console.log('joined session successfully');
                    socket.emit('set-session-acknowledgement', { sessionId: session_id });
                } else {
                    socket.room = data.sessionId;
                    if (socket.room)
                        socket.join(socket.room);
                    console.log('joined successfully');
                    socket.emit('set-socket-acknowledgement', { sessionId: data.sessionId });
                }
                console.log('===================end-session event=====================');
            });
            socket.on('message', (message) => {
                console.log('Message received: ' + message);
                socket.broadcast.emit('update-input', message);
            });
            socket.on('create-room', (roomName: string) => {
                if(io.sockets.adapter.rooms.get(roomName)) {
                    console.log(`Request to join existing room: ${roomName} received!`);
                } else {
                    console.log(`Request to create room: ${roomName} received!`);
                }
                socket.join(roomName);
                socket.broadcast.emit('update-input', roomName);
            });
            socket.on('leave-room', (roomName: string) => {
                console.log(`Request to leave room: ${roomName}`);
                socket.leave(roomName);
                let destination = '';
                socket.broadcast.emit('redirect', destination);
            }) 
        });
    }
    res.end();
}
