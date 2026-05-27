import { Movie } from "@/types/movie";
import { movies } from "@/data/movies";

export function getSimilarMovies(movie: Movie, count: number = 4): Movie[] {
  const scored = movies
    .filter((m) => m.id !== movie.id)
    .map((m) => {
      let score = 0;

      // Genre overlap
      const genreOverlap = m.genre.filter((g) => movie.genre.includes(g)).length;
      score += genreOverlap * 3;

      // Same director
      if (m.director === movie.director) score += 5;

      // Same language
      if (m.language === movie.language) score += 2;

      // Same country
      if (m.country === movie.country) score += 1;

      // Mood overlap
      const moodOverlap = m.mood.filter((md) => movie.mood.includes(md)).length;
      score += moodOverlap * 2;

      // Tag overlap
      const tagOverlap = m.tags.filter((t) => movie.tags.includes(t)).length;
      score += tagOverlap * 1.5;

      // Rating similarity
      const ratingDiff = Math.abs(m.imdbRating - movie.imdbRating);
      score += Math.max(0, 3 - ratingDiff);

      // Year proximity
      const yearDiff = Math.abs(m.year - movie.year);
      score += Math.max(0, 2 - yearDiff / 5);

      return { movie: m, score };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.movie);
}

export function getMoviesByMood(mood: string, count: number = 6): Movie[] {
  return movies
    .filter((m) => m.mood.includes(mood))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function getMoviesByGenre(genre: string, count: number = 6): Movie[] {
  return movies
    .filter((m) => m.genre.includes(genre))
    .sort((a, b) => b.imdbRating - a.imdbRating)
    .slice(0, count);
}

export function getMoviesByCountry(country: string, count: number = 6): Movie[] {
  return movies
    .filter((m) => m.country === country)
    .sort((a, b) => b.imdbRating - a.imdbRating)
    .slice(0, count);
}

export function getMoviesByLanguage(language: string, count: number = 6): Movie[] {
  return movies
    .filter((m) => m.language === language)
    .sort((a, b) => b.imdbRating - a.imdbRating)
    .slice(0, count);
}

export function getMoviesByDirector(director: string, count: number = 6): Movie[] {
  return movies
    .filter((m) => m.director === director)
    .sort((a, b) => b.year - a.year)
    .slice(0, count);
}

export function getHiddenGems(count: number = 6): Movie[] {
  return movies
    .filter((m) => m.isHiddenGem)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function getOscarWinners(count: number = 6): Movie[] {
  return movies
    .filter((m) => m.isOscarWinner)
    .sort((a, b) => b.year - a.year)
    .slice(0, count);
}

export function getTopRated(count: number = 6): Movie[] {
  return [...movies]
    .sort((a, b) => b.imdbRating - a.imdbRating)
    .slice(0, count);
}

export function getRecentlyAdded(count: number = 6): Movie[] {
  return [...movies]
    .sort((a, b) => b.year - a.year)
    .slice(0, count);
}

export function getTrending(count: number = 6): Movie[] {
  // Simulate trending with a mix of high-rated and recent
  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getAIPicksTonight(count: number = 6): Movie[] {
  const hour = new Date().getHours();
  let preferredMood: string;

  if (hour >= 6 && hour < 12) preferredMood = "inspiring";
  else if (hour >= 12 && hour < 17) preferredMood = "feel-good";
  else if (hour >= 17 && hour < 21) preferredMood = "action-packed";
  else preferredMood = "mind-bending";

  const moodMovies = getMoviesByMood(preferredMood, count);
  if (moodMovies.length >= count) return moodMovies;

  // Fallback to top rated
  return getTopRated(count);
}

export function searchMovies(query: string): Movie[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return movies.filter((m) => {
    const searchableText = `
      ${m.title} ${m.director} ${m.cast.join(" ")} 
      ${m.genre.join(" ")} ${m.language} ${m.country} 
      ${m.mood.join(" ")} ${m.tags.join(" ")} ${m.year} ${m.synopsis}
    `.toLowerCase();

    return searchableText.includes(lowerQuery);
  });
}

export function smartSearch(query: string): Movie[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  // Check for natural language patterns
  const patterns = {
    "korean thriller": (m: Movie) => m.language === "Korean" && m.genre.includes("Thriller"),
    "malayalam": (m: Movie) => m.language === "Malayalam",
    "sci-fi": (m: Movie) => m.genre.includes("Sci-Fi"),
    "mind bending": (m: Movie) => m.mood.includes("mind-bending"),
    "feel good": (m: Movie) => m.mood.includes("feel-good"),
    "psychological thriller": (m: Movie) => m.genre.includes("Thriller") && m.mood.includes("dark"),
    "dark": (m: Movie) => m.mood.includes("dark"),
    "emotional": (m: Movie) => m.mood.includes("emotional"),
    "oscar": (m: Movie) => m.isOscarWinner,
    "hidden gem": (m: Movie) => m.isHiddenGem,
    "like interstellar": (m: Movie) => m.genre.includes("Sci-Fi") && m.mood.includes("mind-bending"),
    "like parasite": (m: Movie) => m.language === "Korean" && m.genre.includes("Thriller"),
    "nolan": (m: Movie) => m.director === "Christopher Nolan",
    "miyazaki": (m: Movie) => m.director === "Hayao Miyazaki",
    "bong joon-ho": (m: Movie) => m.director === "Bong Joon-ho",
  };

  for (const [pattern, matcher] of Object.entries(patterns)) {
    if (lowerQuery.includes(pattern)) {
      const matched = movies.filter(matcher);
      if (matched.length > 0) return matched;
    }
  }

  // Fallback to regular search
  return searchMovies(query);
}
