"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <Link
            href="/shop"
            className="text-primary hover:underline text-sm uppercase tracking-wider"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0];
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      image: product.images[0],
    });
    openCart();
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-wider">Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square overflow-hidden bg-card">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? "border-primary"
                      : "border-border hover:border-secondary"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="font-mono text-xs text-secondary uppercase tracking-[0.2em] mb-2">
              {product.category}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
              {product.name}
            </h1>
            <p className="text-primary text-2xl font-bold font-mono mb-8">
              EGP {product.price}
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <p className="text-sm text-secondary uppercase tracking-wider mb-3">
                Size
              </p>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-semibold uppercase border transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-primary text-black border-primary"
                        : "bg-transparent text-secondary border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-primary text-black font-heading font-bold uppercase tracking-wider text-sm hover:bg-primary-gold transition-colors duration-300 mb-8"
            >
              Add to Cart
            </button>

            {/* Description */}
            <div className="border-t border-border pt-8 space-y-6">
              <div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-2">
                  Description
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-2">
                  Care Instructions
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {product.care}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
