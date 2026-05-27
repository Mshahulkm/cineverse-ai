import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 8.5) return "text-emerald-400";
  if (rating >= 7.5) return "text-green-400";
  if (rating >= 6.5) return "text-yellow-400";
  if (rating >= 5.5) return "text-orange-400";
  return "text-red-400";
}

export function getGradientByGenre(genre: string): string {
  const gradients: Record<string, string> = {
    "Sci-Fi": "from-blue-600 via-purple-600 to-cyan-500",
    "Thriller": "from-red-600 via-orange-600 to-yellow-500",
    "Drama": "from-indigo-600 via-purple-600 to-pink-500",
    "Comedy": "from-yellow-400 via-orange-400 to-red-400",
    "Action": "from-red-600 via-rose-600 to-orange-500",
    "Romance": "from-pink-500 via-rose-500 to-red-400",
    "Horror": "from-gray-800 via-red-900 to-black",
    "Documentary": "from-green-600 via-teal-600 to-cyan-500",
  };
  return gradients[genre] || "from-purple-600 via-indigo-600 to-blue-500";
}

export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    "mind-bending": "🧠",
    "emotional": "💔",
    "feel-good": "😊",
    "dark": "🌑",
    "inspiring": "✨",
    "suspenseful": "😰",
    "romantic": "💕",
    "action-packed": "💥",
    "thought-provoking": "🤔",
    "funny": "😂",
  };
  return emojis[mood] || "🎬";
}
