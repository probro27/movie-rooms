import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';

type SearchResults = [MovieInList]

export default function handler(req: NextApiRequest, res: NextApiResponse<SearchResults | MovieNotFound>) {
    if(req.method == 'POST') {
        const searchKeywords: string = req.body.search;
        const encodedSearchKeywords = encodeURIComponent(searchKeywords);
        axios.get(`https://api.themoviedb.org/3/search/movie?query=${encodedSearchKeywords}&api_key=${process.env.API_KEY}`)
            .then((_res) => {
                return res.status(200).send(_res.data);
            })
            .catch((error: AxiosError) => {
                console.log(error);
                return res.status(404).send({ 'notFound': true });
            });
    } else {
        res.status(401).send({ 'notFound': true })
    }
}
