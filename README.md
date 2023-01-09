# Movie Meetup: Watch Films Together Online

Movie Meetup is a web platform that allows users to join a room, like or dislike movies, and receive recommendations based on their preferences using OpenAI. Users can then stream movies together in the same room. It is built using Next.js and integrates with the TMDb API for movie data and the OpenAI API for recommendation generation.

## Features

- Create and join rooms with friends
- Like or dislike movies to receive personalized recommendations using OpenAI
- Stream movies together with synchronized playback
- Mobile-responsive design for optimal user experience on all devices

### Getting Started

#### Prerequisites

- Node.js and npm (comes with Node.js)
- An API key from TMDb (sign up at [their website](https://www.themoviedb.org/))
- An API key from OpenAI (sign up at [their website](https://beta.openai.com/))

#### Installation

1. Clone the repository: `git clone https://github.com/probro27/movie-rooms`
2. Install dependencies: `npm install`
3. Create a file called `.env` in the root directory and add your TMDb and OpenAI API keys:

    ```env
    API_KEY=YOUR_TMDB_API_KEY_HERE
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
    ```

4. Start the development server: `npm run dev`

### Usage

To use the app, go to `http://localhost:3000` in your web browser. You should now be able to create and join rooms, like or dislike movies, and stream movies together.

### Contributing

I welcome contributions to Movie Rooms! If you have an idea for a new feature or have found a bug, please [open an issue](https://github.com/probro27/movie-rooms) or reach out to me!
