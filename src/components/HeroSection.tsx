"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Marquee from "./Marquee";

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll(".hero-line");
      if (!lines) return;

      gsap.from(lines, {
        y: 80,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.5)",
        delay: 3,
      });

      gsap.from(subRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.5)",
        delay: 3.3,
      });

      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(2)",
        delay: 3.5,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#0a0a0a] pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div ref={headlineRef} className="overflow-hidden">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold uppercase tracking-tight leading-[0.9]">
            <span className="hero-line block text-white">OUR MERCH</span>
            <span className="hero-line block text-white">DESERVES</span>
            <span className="hero-line block text-primary">
              A COOL WEBSITE.
            </span>
          </h1>
        </div>

        <p
          ref={subRef}
          className="mt-8 max-w-xl text-secondary text-base md:text-lg leading-relaxed"
        >
          We are Enactus Cairo. A student-run organization building projects,
          brands, and communities — one merch drop at a time.
        </p>

        <div ref={ctaRef} className="mt-10">
          <Link
            href="/shop"
            className="inline-block px-10 py-4 bg-primary text-black font-heading font-bold uppercase tracking-wider text-sm border-4 border-black brutalist-shadow hover:brutalist-shadow-hover hover:bg-white hover:border-black transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Marquee at bottom */}
      <div className="mt-auto pt-16">
        <Marquee />
      </div>
    </section>
  );
}
