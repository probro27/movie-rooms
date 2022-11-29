import { useRouter } from "next/router"
import React, { useEffect } from "react";
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | undefined

export default function RoomHome() {
    const router = useRouter();

    const { id } = router.query;

    useEffect(() => {
        socketInitializer()
    }, []);

    const socketInitializer = async () => {
        await fetch('/api/socket/socket');
        socket = io();
        console.log(socket);
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('set-session-acknowledgement', (data) => {
            sessionStorage.setItem('sessionId', data.sessionId);
        });

        socket.on('redirect', (destination) => {
            window.location.href = destination;
        });
        
        let session_id;

        let data = sessionStorage.getItem('sessionId');
        console.log(`Data: ${data}}`);
        if (data == null) {
            session_id = null; // connecting for the first time
            socket.emit('start-session', { sessionId: session_id });
        } else {
            session_id = data; // connecting nth time
            socket.emit('start-session', { sessionId: session_id });
        }
    }
    
    const leaveRoomHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(`trying to leave room`);
        if (socket != undefined)
            socket.emit('leave-room', id);
        else
            console.log('socket undefined');
    }
    return (
        <div>
            <p>Welcome to room {id}</p>
            <button onClick={leaveRoomHandler}>
                Leave room
            </button>
        </div>
   )
       
}
