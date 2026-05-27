"use client";

import { motion } from "framer-motion";
import { Star, Clock, Play } from "lucide-react";
import { Movie } from "@/types/movie";
import { formatRuntime, getRatingColor } from "@/lib/utils";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  variant?: "default" | "compact" | "featured";
}

export default function MovieCard({ movie, index = 0, variant = "default" }: MovieCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/movie/${movie.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm font-semibold text-white truncate">{movie.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-0.5 text-xs text-yellow-400">
                <Star className="w-3 h-3 fill-yellow-400" />
                {movie.imdbRating}
              </span>
              <span className="text-xs text-white/60">{movie.year}</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/movie/${movie.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group relative rounded-2xl overflow-hidden cursor-pointer neon-glow"
        >
          <div className="aspect-[16/9]">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              {movie.isOscarWinner && (
                <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-[10px] font-medium text-yellow-300">
                  Oscar Winner
                </span>
              )}
              {movie.isHiddenGem && (
                <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-[10px] font-medium text-purple-300">
                  Hidden Gem
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
            <p className="text-sm text-white/60 line-clamp-2 mb-3">{movie.synopsis}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                {movie.imdbRating}
              </span>
              <span className="text-white/50">{movie.year}</span>
              <span className="text-white/50">{movie.genre[0]}</span>
              <span className="flex items-center gap-1 text-white/50">
                <Clock className="w-3 h-3" />
                {formatRuntime(movie.runtime)}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative rounded-xl overflow-hidden cursor-pointer bg-secondary/50 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
      >
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {movie.isOscarWinner && (
              <span className="px-2 py-0.5 bg-yellow-500/80 backdrop-blur-sm rounded text-[10px] font-bold text-black">
                Oscar
              </span>
            )}
            {movie.isHiddenGem && (
              <span className="px-2 py-0.5 bg-purple-500/80 backdrop-blur-sm rounded text-[10px] font-bold text-white">
                Gem
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{movie.imdbRating}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{movie.year}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRuntime(movie.runtime)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/60"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
