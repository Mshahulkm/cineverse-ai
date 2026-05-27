"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { moods, getMoodEmoji } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface MoodWheelProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}

export default function MoodWheel({ onMoodSelect, selectedMood }: MoodWheelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const moodColors: Record<string, string> = {
    "mind-bending": "from-purple-500 to-indigo-500",
    "emotional": "from-pink-500 to-rose-500",
    "feel-good": "from-yellow-400 to-orange-400",
    "dark": "from-gray-700 to-gray-900",
    "inspiring": "from-emerald-400 to-teal-500",
    "suspenseful": "from-red-500 to-orange-500",
    "romantic": "from-pink-400 to-rose-400",
    "action-packed": "from-red-600 to-orange-600",
    "thought-provoking": "from-blue-500 to-indigo-500",
    "funny": "from-yellow-500 to-amber-500",
    "epic": "from-amber-500 to-orange-500",
    "magical": "from-violet-400 to-purple-500",
  };

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">AI Mood Discovery</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">How are you feeling today?</h2>
          <p className="text-muted-foreground">Select a mood and let our AI curate the perfect watchlist</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {moods.map((mood, index) => {
            const isSelected = selectedMood === mood;
            const emoji = getMoodEmoji(mood);
            const colorClass = moodColors[mood] || "from-purple-500 to-pink-500";

            return (
              <motion.button
                key={mood}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMoodSelect(mood)}
                className={`relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-xl`
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <span className="text-lg mr-2">{emoji}</span>
                <span className="capitalize">{mood.replace("-", " ")}</span>
                {isSelected && (
                  <motion.div
                    layoutId="mood-glow"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10"
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
