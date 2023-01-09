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
    room?: string,
    data: {
        likedMovies?: string[],
        dislikedMovies?: string[],
        recommendedMovies?: string[]
    }
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    // It means that socket server was already initialized
    let io: IOServer;
    if (res.socket.server.io) {
        console.log('Socket is already running.');
        io = res.socket.server.io;
    } else {
        console.log('Socket is initializing...');
        io = new IOServer(res.socket.server);
        res.socket.server.io = io;
    }
        io.on('connection', (socket: ISocket) => {
            // socket.data
            // socket.on('start-session', function(data) {
            //     console.log('===================start-session event=================');
            //     console.log(data);
            //     if(data.sessionId == null) {
            //         let session_id = uuid();
            //         socket.room = session_id;
            //         socket.join(socket.room);
            //         console.log('joined session successfully');
            //         socket.emit('set-session-acknowledgement', { sessionId: session_id });
            //     } else {
            //         socket.room = data.sessionId; 
            //         if (socket.room)
            //             socket.join(socket.room);
            //         console.log('joined successfully');
            //         socket.emit('set-socket-acknowledgement', { sessionId: data.sessionId });
            //     }
            //     console.log('===================end-session event=====================');
            // });
            socket.on('message', (message) => {
                console.log('Message received: ' + message);
                socket.broadcast.emit('update-input', message);
            });
            socket.on('create-room', (roomName: string) => {
                console.log('Rooms:');
                console.table(io.sockets.adapter.rooms);
                if(io.sockets.adapter.rooms.get(roomName)) {
                    console.log(`Request to join existing room: ${roomName} received!`);
                    console.table(socket.id);
                } else {
                    console.log(`Request to create room: ${roomName} received!`);
                    console.table(socket.id);
                }
                console.log(`Before Joining:`);
                console.table(socket.rooms);
                socket.join(roomName);
                console.log(`After Joining:`);
                console.table(socket.rooms);
                console.table(io.sockets.adapter.rooms); 
                socket.emit('redirect', `/rooms/${roomName}/movies`);
            });
            socket.on('leave-room', (roomName: string) => {
                console.log(`Request to leave room: ${roomName}`);
                socket.leave(roomName);
                let destination = '/';
                socket.broadcast.emit('redirect', destination);
            }) 
            socket.on('get-recommendation',  (currentRoom: string) => {
                console.log('We are here to check for recomemndations');
                // const sockets = await io.in(currentRoom).fetchSockets();
                console.table(io.sockets.adapter.rooms);
                const socketsInRoom = io.sockets.adapter.rooms.get(currentRoom);
                let getRecommendations = true;
                console.log(socketsInRoom);
                for (let socketId in socketsInRoom) {
                    const socket = io.sockets.sockets.get(socketId);
                    if (socket) {
                        if (socket.data.likedMovies != null || socket.data.dislikedMovies != null) {
                            getRecommendations = getRecommendations && true;
                        } else {
                            getRecommendations = getRecommendations && false;
                        }
                    }
                }
                // console.log('We got sockets!!');
                // console.table(sockets);
                
                // sockets.forEach((socket) => {
                //     if (socket.data.likedMovies != null || socket.data.dislikedMovies != null) {
                //         getRecommendations = getRecommendations && true;
                //     } else {
                //         getRecommendations = getRecommendations && false;
                //     }
                // });
                console.log(`Do we give recommendations: ${getRecommendations}`)
                if (getRecommendations == true) {
                    socket.broadcast.emit('message', 'We should be ready to proceed!!');
                } else {
                    socket.broadcast.emit('message', 'Please wait for others to finish!!');
                }
            })
        });
    res.end();
}
