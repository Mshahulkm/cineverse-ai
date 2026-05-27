export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  language: string;
  country: string;
  director: string;
  cast: string[];
  runtime: number;
  imdbRating: number;
  rottenTomatoes: number;
  synopsis: string;
  poster: string;
  backdrop: string;
  trailer: string;
  awards: string[];
  streaming: string[];
  mood: string[];
  tags: string[];
  isHiddenGem?: boolean;
  isOscarWinner?: boolean;
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  movies: Movie[];
  type: "trending" | "recent" | "ai-picks" | "hidden-gems" | "oscar" | "top-rated" | "genre" | "country" | "director" | "mood";
}

export interface SearchFilters {
  query: string;
  genre: string[];
  language: string[];
  country: string[];
  director: string[];
  year: [number, number];
  rating: [number, number];
  runtime: [number, number];
}
