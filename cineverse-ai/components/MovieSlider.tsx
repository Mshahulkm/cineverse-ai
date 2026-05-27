"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieSliderProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  variant?: "default" | "compact" | "featured";
  id?: string;
}

export default function MovieSlider({ title, subtitle, movies, variant = "default", id }: MovieSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  if (movies.length === 0) return null;

  return (
    <section id={id} className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-white"
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm text-muted-foreground mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border border-white/10 transition-all ${
                canScrollLeft
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border border-white/10 transition-all ${
                canScrollRight
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={`flex-shrink-0 ${
                  variant === "featured"
                    ? "w-[400px] sm:w-[500px]"
                    : variant === "compact"
                    ? "w-[150px] sm:w-[180px]"
                    : "w-[200px] sm:w-[240px]"
                }`}
              >
                <MovieCard movie={movie} index={index} variant={variant} />
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
          {canScrollLeft && (
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
}
