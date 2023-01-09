import { useRouter } from "next/router"
import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import axios, { AxiosResponse } from "axios";
import MovieItem from "../../../components/MovieItem";
import styles from '../../../styles/Home.module.css';
import { useAppContext } from '../../../context/state';
import { socket } from '../../../context/socket';

interface ISocket extends Socket {
    data?: {
        likedMovies: string[]
        dislikedMovies: string[]
        recommendedMovies: string[]
    }
}

let socketLocal: ISocket | undefined

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
        if (socket) {
            socketLocal = socket;
        } else {
            socketLocal = io();
        }
        console.log(socketLocal);
        socketLocal.on('connect', () => {
            console.log('connected');
        });

        // socket.on('set-session-acknowledgement', (data) => {
        //     sessionStorage.setItem('sessionId', data.sessionId);
        // });

        socketLocal.on('message', (msg) => {
            console.log(`Message from server: ${msg}`);
        })

        socketLocal.on('redirect', (destination) => {
            window.location.href = destination;
        });
        
        // let session_id;

        // let data = sessionStorage.getItem('sessionId');
        // console.log(`Data: ${data}}`);
        // if (data == null) {
        //     session_id = null; // connecting for the first time
        //     socket.emit('start-session', { sessionId: session_id });
        // } else {
        //     session_id = data; // connecting nth time
        //     socket.emit('start-session', { sessionId: session_id });
        // }

    }

    const getRecommendationsHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(`Get recommendations clicked!!!`);
        if (socketLocal) {
            console.log('socket exists!!');
            socketLocal.data = {
                likedMovies: likedMovies,
                dislikedMovies: dislikedMovies,
                recommendedMovies: []
            }
            console.log('socket.data assigned');
            console.error(`recommendation event emmitted with ${id}`)
            socketLocal.emit('get-recommendation', id);
        } else {
            console.log('socket undefined');
            console.log(socketLocal);
        }
    };
    
    const leaveRoomHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(`trying to leave room`);
        if (socketLocal != undefined)
            socketLocal.emit('leave-room', id);
        else
            console.log('socketLocal undefined');
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
