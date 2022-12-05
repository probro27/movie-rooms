import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';


export default function popularHandler(req: NextApiRequest, res: NextApiResponse<PopularityData>) {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US`)
        .then((_res) => {
            res.send(_res.data);
        })
        .catch((_error: AxiosError) => {
            console.log(_error);
            res.json({ 
                'page': 1,
                'results': 'not found'
            });
        })
}
