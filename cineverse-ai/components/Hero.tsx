"use client";

import { motion } from "framer-motion";
import { Play, Star, TrendingUp, Sparkles } from "lucide-react";
import { Movie } from "@/types/movie";
import { getTrending } from "@/lib/recommendations";
import { useEffect, useState } from "react";

export default function Hero() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const trending = getTrending(1);
    setFeaturedMovie(trending[0]);
  }, []);

  if (!featuredMovie) return null;

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredMovie.backdrop}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/60" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI Featured
            </span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Trending Now
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
          >
            {featuredMovie.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-4 mb-6 text-sm text-white/70"
          >
            <span>{featuredMovie.year}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>{featuredMovie.genre.join(", ")}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {featuredMovie.imdbRating}
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>{featuredMovie.language}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-white/60 mb-8 max-w-2xl leading-relaxed"
          >
            {featuredMovie.synopsis}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-4"
          >
            <button className="group relative px-8 py-3.5 bg-white text-black rounded-xl font-semibold flex items-center gap-2 hover:bg-white/90 transition-all overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5 fill-black" />
                Watch Trailer
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
            <button className="px-8 py-3.5 glass rounded-xl font-semibold text-white hover:bg-white/10 transition-all border border-white/20">
              More Info
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
