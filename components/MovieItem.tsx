import React from "react";
import Image from 'next/image';

type Props = {
    key: number,
    movie: MovieInList
}

export default function MovieItem({ key, movie }: Props) {
    let posterPath = 'https://image.tmdb.org/t/p/w185';
    return (
        <div>
            <Image width={100} height={100} src={posterPath + movie.poster_path} alt={`{movie.title} poster`}/>
            <p key={key}>{movie.title}</p>
        </div>
    )
}
