import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';

export default function handler(req: NextApiRequest, res: NextApiResponse<Movie | MovieNotFound>) {
    const movieId = req.query.id;
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`)
        .then((_res) => {
            res.send(_res.data);
        })
        .catch((_error: AxiosError) => {
            console.log(_error);
            res.json({ 
                'notFound': true
            });
        })
}
