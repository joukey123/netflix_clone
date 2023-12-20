const API_KEY = "51c4b154b8d67daefd8ebbf2fcbce020";
const BASE_URL = "https://api.themoviedb.org/3";

interface IMovie {
  id: number,
  backdrop_path : string,
  poster_path: string,
  title : string,
  overview: string,
}

export interface IMoviesData {
  dates: {
    maximum: string,
    minimum: string,
  },
  results: IMovie[],
  total_pages: number,
  total_results: number
}

export function getMovies<IMoviesData>() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}


//img : https://image.tmdb.org/t/p/original/

