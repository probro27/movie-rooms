import { useState, useEffect } from "react";
import io from 'socket.io-client';

import type { ChangeEvent } from "react";
import type { Socket } from 'socket.io-client';
import Link from "next/link";

let socket: undefined | Socket;

export default function Client() {
    const [ input, setInput ] = useState('');
    const [ message, setMessage ] = useState('');
    useEffect(() => {
        socketInitializer()
    }, []);

    const socketInitializer = async () => {
        fetch('/api/socket/socket');
        socket = io();

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('set-session-acknowledgement', (data) => {
            sessionStorage.setItem('sessionId', data.sessionId);
        })

        socket.on('update-input', (msg) => {
            console.log(`Message received: ${msg}`);
            setMessage(msg);
        })

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

    const formSubmitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (socket != undefined) {
            socket.emit('create-room', input);
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={formSubmitHandler}>
                <input 
                    placeholder="Type something"
                    value={input}
                    onChange={onChangeHandler}
                />
                <button type="submit">
                    Submit
                </button>
            </form> 
        <p>Go to room: <Link href={ `/rooms/${message}` }>{message}</Link></p>
        </div>
    )
}
