import React, { useState, useEffect } from "react";
import io from 'socket.io-client';

import type { ChangeEvent } from "react";
import type { Socket } from 'socket.io-client';
import Link from "next/link";
let socket: Socket | undefined;
export default function UploadForm() {

    const [ input, setInput ] = useState('');
    const [ message, setMessage ] = useState('');
    useEffect(() => {
        socketInitializer()
    }, []);

    const socketInitializer = async () => {
        fetch('/api/socket/socket');
        socket = io();
        console.log(socket);
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

        socket.on('redirect', (destination) => {
            console.log(`Redirect request received: ${destination}`)
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
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8">
    <div>
      <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create a new Room!</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Join an existing one!</a>
      </p>
    </div>
    <form className="mt-8 space-y-6" onSubmit={formSubmitHandler}>
      <input type="hidden" name="remember" value="true" />
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input id="email-address" name="email" type="text" autoComplete="text" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Room Name" onChange={onChangeHandler} />
        </div>
        <div>
          <label htmlFor="username" className="sr-only">username</label>
          <input id="username" name="username" type="text" autoComplete="current-username" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Username" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
        </div>
      </div>

      <div>
        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
            </svg>
          </span>
          Create a room!
        </button>
      </div>
    </form>
  </div>
</div>
  )
}
