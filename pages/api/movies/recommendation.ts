import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';
import { OpenAIApi, Configuration } from "openai";

const configuration: Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai: OpenAIApi = new OpenAIApi(configuration);

type RecommendationResults = MovieInList[] | MovieNotFound

export default async function recommendationHandler(req: NextApiRequest, res: NextApiResponse<RecommendationResults>) {
    let likedMovies: string[] = req.body.likedMovies;
    let dislikedMovies: string[] = req.body.dislikedMovies;
    let recommendedMovieList: string[] = await getMovieListOpenAI(likedMovies, dislikedMovies);
    if (recommendedMovieList.length == 0) {
        return res.status(401).send({ 'notFound': true });
    } else {
        console.log('We have recommended movies');
        let finalRecommendationList: MovieInList[] = [];
        for(let movie in recommendedMovieList) {
            console.log(recommendedMovieList[movie]);
            let searchedMovie: MovieInList[] = []
            const searchKeywords: string = recommendedMovieList[movie].trim();
            const encodedSearchKeywords = encodeURIComponent(searchKeywords);
            await axios.get(`https://api.themoviedb.org/3/search/movie?query=${encodedSearchKeywords}&api_key=${process.env.API_KEY}`)
                .then((_res) => {
                    console.log(`${searchKeywords} pushed`);
                    searchedMovie.push(_res.data);
                })
                .catch((error: AxiosError) => {
                    console.log(`${searchKeywords} not pushed`);
                    console.log(error);
                    return res.status(404).send({ 'notFound': true });
                });
            if(searchedMovie.length != 0) {
                console.log(`${searchedMovie[0].title} given as final recommendation`);
                finalRecommendationList.push(searchedMovie[0]);
            }
        }
        if(finalRecommendationList.length != 0) {
            return res.status(201).send(finalRecommendationList);
        } else {
            console.log(`length is 0`);
            return res.status(404).send({ 'notFound': true });
        }
    }
}

async function getMovieListOpenAI(moviesLiked: string[], moviesDisliked: string[]): Promise<string[]> {
    let recommendedMovieList: string[] = []
    const prompt = `Recommend me list of movies that are not mentioned in this prompt: I like ${moviesLiked} and I don't like ${moviesDisliked}`;
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        temperature: 0.4,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 2,
        presence_penalty: 0,
        best_of: 1
    });
    console.log(`Actual text: ${completion.data.choices[0].text}`);
    let text = completion.data.choices[0].text;
    if(!text) {
        return recommendedMovieList;
    } else {
        let recommendedMovieListCopy: string[] = [];
        text = text.trimEnd();
        const re = new RegExp('\n[0-9]. |\n-|,')
        recommendedMovieListCopy = text.split(re);
        console.log(recommendedMovieListCopy);
        
        for (let j = 1; j < recommendedMovieListCopy.length; j++) {
            let recommendedMovie = recommendedMovieListCopy[j];
            console.log(recommendedMovie);
            recommendedMovieList.push(recommendedMovie.trim());
        }
    }
    console.log(`Final list: ${recommendedMovieList}`);
    console.log(`Final list element: ${recommendedMovieList[0]}`)
    return recommendedMovieList;
}
