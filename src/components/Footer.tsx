"use client";

import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import Marquee from "./Marquee";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-border">
      {/* Marquee */}
      <Marquee />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary uppercase tracking-wider">
              ENACTUS CAIRO
            </h2>
            <p className="mt-4 text-secondary text-sm leading-relaxed max-w-xs">
              A student-run organization building projects, brands, and
              communities — one merch drop at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "What We Do", href: "/#built-different" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-secondary text-sm hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/EnactusCairo?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/enactuscairouniversity?igsh=aXdsdzZ5ZWw5NzJ3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              {/* TikTok (custom SVG since Lucide doesn't have it) */}
              <a
                href="https://www.tiktok.com/@enactuscairo?_r=1&_t=ZS-94by5vTm7to"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-gold transition-colors"
                aria-label="TikTok"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-secondary text-xs tracking-wider">
            © 2025 Enactus Cairo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
