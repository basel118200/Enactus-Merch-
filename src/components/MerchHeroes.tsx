"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const heroes = [
  {
    name: "Basel Bahaa",
    role: "Financial Vice President",
    image: "/heroes/basel.jpg",
  },
  {
    name: "Ahmed Ashraf",
    role: "Resource Management Leader",
    image: "/heroes/ahmed.jpg",
  },
  {
    name: "Eyad Ahmed",
    role: "Branding Vice President",
    image: "/heroes/eyad.jpg",
  },
  {
    name: "Seif Rabie",
    role: "Social Media Leader",
    image: "/heroes/seif.jpg",
  },
  {
    name: "Farida Hafez",
    role: "Social Media Leader",
    image: "/heroes/farida.jpg",
  },
  {
    name: "RM Team",
    role: "Merch Warriors",
    image: "/heroes/rm-team.jpg",
  },
];

export default function MerchHeroes() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".hero-card");
      if (!cards) return;

      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="merch-heroes"
      className="py-32 md:py-48 bg-[#0a0a0a] border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs text-secondary uppercase tracking-[0.3em] mb-4">
          The Team Behind The Drip
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tight mb-16">
          Merch <span className="text-primary">Heroes</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {heroes.map((hero, i) => (
            <div
              key={i}
              className="hero-card group"
            >
              <div className="relative aspect-[3/4] overflow-hidden border-2 border-border bg-black transition-all duration-300 group-hover:border-primary group-hover:brutalist-shadow">
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  className={`${
                    hero.name === "RM Team" ? "object-contain" : "object-cover"
                  } grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105`}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                  {hero.name}
                </h3>
                <p className="text-[10px] text-secondary uppercase tracking-widest mt-1">
                  {hero.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
