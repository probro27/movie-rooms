import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import type { ChangeEvent } from "react";
import type { Socket } from "socket.io-client";
import { socket } from "../context/socket";

let socketLocal: Socket | undefined;

export default function UploadForm() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    if (socket) {
      socketLocal = socket;
    } else {
      socketLocal = io();
    }
    
    console.log(socketLocal);
    socketLocal.on("connect", () => {
      console.log("connected");
    });

    // socket.on("set-session-acknowledgement", (data) => {
    //   sessionStorage.setItem("sessionId", data.sessionId);
    // });

    socketLocal.on("update-input", (msg) => {
      console.log(`Message received: ${msg}`);
      setMessage(msg);
    });

    socketLocal.on("redirect", (destination) => {
      console.log(`Redirect request received: ${destination}`);
      console.table(socketLocal);
      window.location.href = destination;
    });

    // let session_id;

    // let data = sessionStorage.getItem("sessionId");
    // console.log(`Data: ${data}}`);
    // if (data == null) {
    //   session_id = null; // connecting for the first time
    //   socket.emit("start-session", { sessionId: session_id });
    // } else {
    //   session_id = data; // connecting nth time
    //   socket.emit("start-session", { sessionId: session_id });
    // }
  };

  const formSubmitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (socketLocal != undefined) {
      socketLocal.emit("create-room", input);
    }
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    e.preventDefault();
  };
  return (
    <div
      id="form"
      className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition ease-in delay-100"
    >
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-32 w-auto"
            src="Logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-netflix drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)]">
            Create a new Room!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-100">
            Or
            <a
              href="#"
              className="font-medium text-netflix hover:text-red-100 drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)]"
            >
              Join an existing one!
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formSubmitHandler}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
            <label className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Room Name"
                    name="name"
                    onChange={onChangeHandler}
                    required
                ></input>
                <span className="border"></span>
            </label>
            </div>
            <div>
            <label className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    name="name"
                    required
                ></input>
                <span className="border"></span>
            </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Create a room!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
