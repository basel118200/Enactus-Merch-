"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      image: product.images[0],
    });
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/shop/${product.slug}`}>
        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-card">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                hovered ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Hover overlay */}
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={handleQuickAdd}
                className="px-6 py-3 border border-primary text-primary font-heading font-bold uppercase tracking-wider text-xs hover:bg-primary hover:text-black transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 space-y-1">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-primary font-mono text-sm font-bold">
              EGP {product.price}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
