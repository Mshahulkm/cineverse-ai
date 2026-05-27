"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CategoryPillsProps {
  categories: string[];
  selected: string[];
  onSelect: (category: string) => void;
  title: string;
  getIcon?: (category: string) => string;
}

export default function CategoryPills({ categories, selected, onSelect, title, getIcon }: CategoryPillsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayCategories = showAll ? categories : categories.slice(0, 8);

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-lg font-semibold text-white"
          >
            {title}
          </motion.h3>
          {categories.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category, index) => {
            const isSelected = selected.includes(category);
            return (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {getIcon ? `${getIcon(category)} ${category}` : category}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
