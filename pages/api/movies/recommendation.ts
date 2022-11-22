import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';
import { OpenAIApi, Configuration } from "openai";

const configuration: Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai: OpenAIApi = new OpenAIApi(configuration);

type RecommendationResults = [Movie?] | MovieNotFound

export default function handler(req: NextApiRequest, res: NextApiResponse<RecommendationResults>) {
    let likedMovies: [string?] = req.body.likedMovies;
    let dislikedMovies: [string?] = req.body.dislikedMovies;
    let recommendedMovieList: [string?] = getMovieListOpenAI(likedMovies, dislikedMovies);
    if (!recommendedMovieList) {
        return res.status(401).send({ 'notFound': true });
    } else {
        let finalRecommendationList: [Movie?] = [];
        for(let movie in recommendedMovieList) {
            let searchedMovie: [MovieInList?] = []
            axios.post('/api/movie/search', {
                search: movie
            })
                .then((_res) => {
                    searchedMovie = _res.data;
                })
                .catch((_error) => {
                    console.log(_error);
                });
            if(searchedMovie) {
                const movieId = searchedMovie[0]?.id;
                axios.get(`/api/movie/${movieId}`)
                    .then((_res) => finalRecommendationList.push(_res.data))
                    .catch((_error) => console.log(_error));
            }
        }
        if(finalRecommendationList != undefined) {
            return res.status(201).send(finalRecommendationList);
        } else {
            return res.status(404).send({ 'notFound': true });
        }
    }
}

function getMovieListOpenAI(moviesLiked: [string?], moviesDisliked: [string?]): [string?] {
    let recommendedMovieList: [string?] = []
    const prompt = `Recommend me movies that are not mentioned in this prompt: I like ${moviesLiked} and I don't like ${moviesDisliked}`;
    const completion =  openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        temperature: 0.8,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 2,
        presence_penalty: 0,
        best_of: 1
    });
    console.log(completion);
    return recommendedMovieList;
}
