"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSlider from "@/components/MovieSlider";
import MovieGrid from "@/components/MovieGrid";
import MoodWheel from "@/components/MoodWheel";
import CategoryPills from "@/components/CategoryPills";
import Footer from "@/components/Footer";
import { movies, genres, languages, countries, directors } from "@/data/movies";
import {
  getTrending,
  getRecentlyAdded,
  getAIPicksTonight,
  getHiddenGems,
  getOscarWinners,
  getTopRated,
  getMoviesByGenre,
  getMoviesByLanguage,
  getMoviesByCountry,
  getMoviesByDirector,
  getMoviesByMood,
  smartSearch,
} from "@/lib/recommendations";
import { Sparkles, TrendingUp, Clock, Gem, Award, Star, Film, Globe, User, Zap } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return smartSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setIsSearching(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  const filteredMovies = useMemo(() => {
    let filtered = [...movies];

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((m) =>
        m.genre.some((g) => selectedGenres.includes(g))
      );
    }

    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((m) => selectedLanguages.includes(m.language));
    }

    if (selectedCountries.length > 0) {
      filtered = filtered.filter((m) => selectedCountries.includes(m.country));
    }

    if (selectedMood) {
      filtered = filtered.filter((m) => m.mood.includes(selectedMood));
    }

    return filtered;
  }, [selectedGenres, selectedLanguages, selectedCountries, selectedMood]);

  const trending = useMemo(() => getTrending(8), []);
  const recentlyAdded = useMemo(() => getRecentlyAdded(8), []);
  const aiPicks = useMemo(() => getAIPicksTonight(8), []);
  const hiddenGems = useMemo(() => getHiddenGems(8), []);
  const oscarWinners = useMemo(() => getOscarWinners(8), []);
  const topRated = useMemo(() => getTopRated(8), []);
  const koreanCinema = useMemo(() => getMoviesByLanguage("Korean", 8), []);
  const malayalamFavorites = useMemo(() => getMoviesByLanguage("Malayalam", 8), []);
  const hollywoodEssentials = useMemo(() => getMoviesByCountry("USA", 8), []);
  const animeCollection = useMemo(() => getMoviesByGenre("Animation", 8), []);
  const sciFiCollection = useMemo(() => getMoviesByGenre("Sci-Fi", 8), []);
  const thrillerCollection = useMemo(() => getMoviesByGenre("Thriller", 8), []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24"
          >
            <MovieGrid
              movies={searchResults}
              title={`Search Results for "${searchQuery}"`}
              subtitle={`Found ${searchResults.length} movies`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pt-16">
              <Hero />
            </div>

            {/* AI Picks Tonight */}
            <MovieSlider
              id="ai-picks"
              title="AI Picks Tonight"
              subtitle="Curated just for you based on the time of day"
              movies={aiPicks}
              variant="featured"
            />

            {/* Mood Wheel */}
            <MoodWheel onMoodSelect={handleMoodSelect} selectedMood={selectedMood} />

            {/* Filtered Results */}
            {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedCountries.length > 0 || selectedMood) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <MovieGrid
                  movies={filteredMovies}
                  title="Filtered Results"
                  subtitle={`${filteredMovies.length} movies match your criteria`}
                />
              </motion.div>
            )}

            {/* Category Filters */}
            <CategoryPills
              title="Genres"
              categories={genres}
              selected={selectedGenres}
              onSelect={handleGenreToggle}
            />
            <CategoryPills
              title="Languages"
              categories={languages}
              selected={selectedLanguages}
              onSelect={handleLanguageToggle}
            />
            <CategoryPills
              title="Countries"
              categories={countries}
              selected={selectedCountries}
              onSelect={handleCountryToggle}
            />

            {/* Trending */}
            <MovieSlider
              id="trending"
              title="Trending Worldwide"
              subtitle="What's hot right now"
              movies={trending}
              variant="default"
            />

            {/* Recently Added */}
            <MovieSlider
              id="recent"
              title="Recently Added"
              subtitle="Fresh from the cinema"
              movies={recentlyAdded}
              variant="default"
            />

            {/* Hidden Gems */}
            <MovieSlider
              id="hidden-gems"
              title="Hidden Gems"
              subtitle="Discover movies you might have missed"
              movies={hiddenGems}
              variant="default"
            />

            {/* Oscar Winners */}
            <MovieSlider
              id="oscar"
              title="Oscar Winners"
              subtitle="Academy Award winning masterpieces"
              movies={oscarWinners}
              variant="featured"
            />

            {/* Top IMDb Rated */}
            <MovieSlider
              id="top-rated"
              title="Top IMDb Rated"
              subtitle="The highest rated films of all time"
              movies={topRated}
              variant="default"
            />

            {/* Korean Cinema */}
            <MovieSlider
              title="Korean Cinema"
              subtitle="The best of K-movies"
              movies={koreanCinema}
              variant="default"
            />

            {/* Malayalam Favorites */}
            <MovieSlider
              title="Malayalam Favorites"
              subtitle="Gems from Kerala"
              movies={malayalamFavorites}
              variant="default"
            />

            {/* Hollywood Essentials */}
            <MovieSlider
              title="Hollywood Essentials"
              subtitle="Must-watch American cinema"
              movies={hollywoodEssentials}
              variant="default"
            />

            {/* Anime Collection */}
            <MovieSlider
              title="Anime Collection"
              subtitle="Stunning animation from Japan"
              movies={animeCollection}
              variant="default"
            />

            {/* Mind Bending Sci-Fi */}
            <MovieSlider
              title="Mind Bending Sci-Fi"
              subtitle="Question reality with these picks"
              movies={sciFiCollection}
              variant="featured"
            />

            {/* Psychological Thrillers */}
            <MovieSlider
              title="Psychological Thrillers"
              subtitle="Edge-of-your-seat suspense"
              movies={thrillerCollection}
              variant="default"
            />

            {/* Director Spotlights */}
            {["Christopher Nolan", "Bong Joon-ho", "Denis Villeneuve"].map((director) => {
              const directorMovies = getMoviesByDirector(director, 6);
              if (directorMovies.length === 0) return null;
              return (
                <MovieSlider
                  key={director}
                  title={`${director} Collection`}
                  subtitle={`Movies directed by ${director}`}
                  movies={directorMovies}
                  variant="compact"
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
