import { useRouter } from "next/router"
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import axios, { AxiosResponse } from "axios";
import MovieItem from "../../../components/MovieItem";
import styles from '../../../styles/Home.module.css';
import { useAppContext } from '../../../context/state';

interface ISocket extends Socket {
    data?: {
        likedMovies: string[]
        dislikedMovies: string[]
        recommendedMovies: string[]
    }
}

let socket: ISocket | undefined

interface Res {
    data:[MovieInList]
}

export default function RoomHome() {
    let posterPath = 'https://image.tmdb.org/t/p/w185';
    const router = useRouter();
    const [ movies, setMovies ] = useState({} as Res);
    const [ page, setPage ] = useState(0);
    let { likedMovies, dislikedMovies } = useAppContext();
    const { id } = router.query;

    useEffect(() => {
        socketInitializer()
        axios.get('/api/movies/popular')
            .then((response: AxiosResponse<PopularityData>) => {
                console.log(response)
                if (response.data.results != 'not found') {
                    setMovies({ 'data': response.data.results });
                    setPage(response.data.page);
                }
            })
            .catch((error) => console.log(error));
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

        socket.on('message', (msg) => {
            console.log(`Message from server: ${msg}`);
        })

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

    const getRecommendationsHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(`Get recommendations clicked!!!`);
        if (socket) {
            console.log('socket exists!!');
            socket.data = {
                likedMovies: likedMovies,
                dislikedMovies: dislikedMovies,
                recommendedMovies: []
            }
            console.log('socket.data assigned');
            console.error(`recommendation event emmitted with ${id}`)
            socket.emit('get-recommendation', id);
        } else {
            console.log('socket undefined');
            console.log(socket);
        }
    };
    
    const leaveRoomHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(`trying to leave room`);
        if (socket != undefined)
            socket.emit('leave-room', id);
        else
            console.log('socket undefined');
    }
    return (
        <div className={`{styles.container} bg-scroll bg-center bg-cover bg-slate-800`}>
            <p>Welcome to Movie room {id}</p>
            <div className={styles.main}>
                <div className="grid grid-cols-8 gap-2">
                    {
                        movies.data ?
                            Array.from(movies.data).map((element) => {
                                return <MovieItem key={movies.data.findIndex((x) => x == element)} movie={element} />
                            })
                        : null
                    }
                </div>
            </div>
            <button onClick={getRecommendationsHandler}>
                Get Recommendations
            </button>
            <button onClick={leaveRoomHandler}>
                Leave room
            </button>
        </div>
   )
       
}
