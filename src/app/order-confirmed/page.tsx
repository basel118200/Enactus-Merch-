"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function OrderConfirmedPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} className="text-primary" />
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4">
          Order Confirmed
        </h1>

        <p className="text-secondary text-sm leading-relaxed mb-10">
          Thank you for your purchase! Your Enactus Cairo merch is on its way.
          You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-black font-heading font-bold uppercase tracking-wider text-xs hover:bg-primary-gold transition-colors duration-300"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-border text-secondary font-heading font-semibold uppercase tracking-wider text-xs hover:border-primary hover:text-primary transition-colors duration-300"
          >
            Back Home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
