"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { openCart, items } = useCartStore(); // Adjusted to keep openCart and use 'items'
  const count = items.length; // Adjusted to calculate count from 'items' array

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50); // Changed setScrolled to setIsScrolled
    window.addEventListener("scroll", onScroll);

    // Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "What We Do", href: "/#built-different" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-background border-b-4 border-white" : "py-8 bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-heading text-lg md:text-xl font-bold tracking-[0.15em] text-primary uppercase">
              ENACTUS CAIRO
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm uppercase tracking-wider text-secondary hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm uppercase tracking-wider text-secondary hover:text-white transition-colors"
                title="My Orders"
              >
                <User size={18} />
                <span className="max-w-[100px] truncate">{user.email?.split('@')[0] || 'User'}</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="text-sm uppercase tracking-wider text-secondary hover:text-white transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              href="/shop"
              className="px-6 py-2 bg-primary text-black text-sm font-bold uppercase tracking-wider border-2 border-primary brutalist-shadow-sm hover:brutalist-shadow-hover hover:bg-white hover:border-white transition-all duration-200"
            >
              Shop
            </Link>
            <button
              onClick={openCart}
              className="relative text-secondary hover:text-white transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-black text-[10px] font-bold flex items-center justify-center border border-black">
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={openCart}
              className="relative text-secondary hover:text-white transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-black text-[10px] font-bold flex items-center justify-center border border-black">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-32 px-6"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-6 text-white"
            >
              <X size={32} />
            </button>
            {[
              ...navLinks,
              { label: "Shop", href: "/shop" },
              user ? { label: "My Account", href: "/account" } : { label: "Login", href: "/auth" }
            ].map(
              (link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-heading text-3xl font-bold uppercase tracking-wider text-white hover:text-primary transition-colors text-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
