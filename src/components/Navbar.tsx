"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { openCart, totalItems } = useCartStore();
  const count = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-border"
            : "py-5 bg-transparent"
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
                <span className="max-w-[100px] truncate">{user.email.split('@')[0]}</span>
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
              className="px-5 py-2 bg-primary text-black text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-transparent hover:text-primary border-2 border-primary transition-all duration-300"
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
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
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
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
          >
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
                    onClick={() => setMobileOpen(false)}
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
