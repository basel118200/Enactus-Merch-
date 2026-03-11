"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="min-h-screen bg-[#0a0a0a] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-4">
            SHOP
          </h1>
          <p className="text-secondary text-sm md:text-base max-w-md mb-10">
            Limited edition merch drops. Rep Enactus Cairo with style.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-heading font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-black border-primary"
                  : "bg-transparent text-secondary border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-secondary py-20 text-sm">
            No products in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
