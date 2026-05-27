"use client";

import { motion } from "framer-motion";
import { Film, Heart, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-bold text-gradient">CineVerse AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered cinematic movie discovery. Find your next favorite film with intelligent recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Discover</h4>
            <ul className="space-y-2">
              {["Trending", "New Releases", "Top Rated", "Hidden Gems", "Oscar Winners"].map((item) => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-muted-foreground hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-semibold text-white mb-4">Genres</h4>
            <ul className="space-y-2">
              {["Sci-Fi", "Drama", "Thriller", "Comedy", "Action", "Romance"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Subtitle Sources</h4>
            <ul className="space-y-2">
              {[
                { name: "MSone Malayalam", url: "https://malayalamsubtitles.org/" },
                { name: "Malayalam Subtitles", url: "https://malayalamsubtitles.in/" },
                { name: "Movie Mirror", url: "https://moviemirrorsubtitles.com/" },
              ].map((source) => (
                <li key={source.name}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-purple-400 transition-colors"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for cinema lovers
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            All movie metadata is for discovery purposes only. Subtitle sources credited.
          </p>
        </div>
      </div>
    </footer>
  );
}
