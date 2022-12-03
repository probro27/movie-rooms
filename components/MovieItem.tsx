import React from "react";

type Props = {
    key: number,
    movie: MovieInList
}

export default function MovieItem({ key, movie }: Props) {
    return (
        <div>
            <p key={key}>{movie.title}</p>
        </div>
    )
}
