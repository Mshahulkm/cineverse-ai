"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  User,
  Award,
  Play,
  ArrowLeft,
  ExternalLink,
  Heart,
  Share2,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { Movie } from "@/types/movie";
import { movies } from "@/data/movies";
import { getSimilarMovies, getMoviesByDirector, getMoviesByMood } from "@/lib/recommendations";
import { formatRuntime, getRatingColor, getMoodEmoji } from "@/lib/utils";
import MovieSlider from "@/components/MovieSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);
  const [moodMovies, setMoodMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const movieId = params.id as string;
    const found = movies.find((m) => m.id === movieId);
    if (found) {
      setMovie(found);
      setSimilarMovies(getSimilarMovies(found, 8));
      setDirectorMovies(getMoviesByDirector(found.director, 6).filter((m) => m.id !== found.id));
      setMoodMovies(getMoviesByMood(found.mood[0], 6).filter((m) => m.id !== found.id));
    }
  }, [params.id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-32 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Poster & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play Button */}
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 group-hover:bg-white/30 transition-all"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </motion.div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                Watch Trailer
              </button>
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            {/* Title & Badges */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {movie.isOscarWinner && (
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-300 flex items-center gap-1.5">
                    <Award className="w-3 h-3" />
                    Oscar Winner
                  </span>
                )}
                {movie.isHiddenGem && (
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Hidden Gem
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-lg text-muted-foreground">
                {movie.year} • Directed by {movie.director}
              </p>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{movie.imdbRating}</p>
                  <p className="text-xs text-muted-foreground">IMDb</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                  <Clapperboard className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{movie.rottenTomatoes}%</p>
                  <p className="text-xs text-muted-foreground">Rotten Tomatoes</p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
              <p className="text-white/70 leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Runtime</span>
                </div>
                <p className="text-white font-semibold">{formatRuntime(movie.runtime)}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Year</span>
                </div>
                <p className="text-white font-semibold">{movie.year}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Language</span>
                </div>
                <p className="text-white font-semibold">{movie.language}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Film className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Country</span>
                </div>
                <p className="text-white font-semibold">{movie.country}</p>
              </div>
              <div className="glass rounded-xl p-4 col-span-2 sm:col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Director</span>
                </div>
                <p className="text-white font-semibold">{movie.director}</p>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Cast
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-300"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Moods */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Moods
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.mood.map((m) => (
                  <span
                    key={m}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-sm text-white flex items-center gap-2"
                  >
                    <span>{getMoodEmoji(m)}</span>
                    <span className="capitalize">{m.replace("-", " ")}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Awards */}
            {movie.awards.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Awards
                </h3>
                <div className="space-y-2">
                  {movie.awards.map((award) => (
                    <div
                      key={award}
                      className="flex items-center gap-3 px-4 py-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl"
                    >
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-white">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Available On
              </h3>
              <div className="flex flex-wrap gap-3">
                {movie.streaming.map((platform) => (
                  <span
                    key={platform}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-300 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="flex gap-3 pt-4">
              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-xl text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                IMDb
              </a>
              <a
                href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-xl text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Rotten Tomatoes
              </a>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-16 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
              <p className="text-sm text-muted-foreground">Powered by our intelligent recommendation engine</p>
            </div>
          </motion.div>

          {similarMovies.length > 0 && (
            <MovieSlider
              title="Similar Movies"
              subtitle="Because you viewed this film"
              movies={similarMovies}
              variant="default"
            />
          )}

          {directorMovies.length > 0 && (
            <MovieSlider
              title={`More from ${movie.director}`}
              subtitle="Explore the director's filmography"
              movies={directorMovies}
              variant="default"
            />
          )}

          {moodMovies.length > 0 && (
            <MovieSlider
              title={`More ${movie.mood[0].replace("-", " ")} Movies`}
              subtitle="Same mood, different stories"
              movies={moodMovies}
              variant="default"
            />
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={movie.trailer}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}
