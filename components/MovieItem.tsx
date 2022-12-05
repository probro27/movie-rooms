import React from "react";
import Image from 'next/image';

type Props = {
    key: number,
    movie: MovieInList
}

export default function MovieItem({ key, movie }: Props) {
    let posterPath = 'https://image.tmdb.org/t/p/w185';
    return (
        <div className="max-w-2 drop-shadow-lg">
            <Image className="mix-blend-overlay" width={150} height={150} style={{ 'width': 'auto', 'height': 'auto' }} src={posterPath + movie.poster_path} alt={`{movie.title} poster`}/>
            {/* <div
        className={`bg-[url("${posterPath + movie.poster_path}")] object-cover h-96 w-full bg-cover bg-center text-center`}></div> */}
            <p className="truncate" key={key}>{movie.title}</p>
            <div className="flex flex-row opacity-70 meta">
                <div>
                    {movie.release_date.substring(0, 4)}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
                <div>
                    {movie.original_language.toUpperCase()}
                </div>
            </div>
        </div>
    )
}
