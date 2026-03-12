"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FolderKanban,
  Palette,
  DollarSign,
  Users,
  Film,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const departments = [
  {
    icon: FolderKanban,
    name: "PROJECTS",
    desc: "Turning ideas into real-world impact through entrepreneurship",
  },
  {
    icon: Palette,
    name: "BRANDING",
    desc: "Creating identities that speak before words do",
  },
  {
    icon: DollarSign,
    name: "FINANCIAL",
    desc: "Managing resources, driving sustainable growth",
  },
  {
    icon: Users,
    name: "HR",
    desc: "Building the team that builds everything else",
  },
  {
    icon: Film,
    name: "MULTIMEDIA",
    desc: "Visual storytelling that moves people",
  },
];

export default function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".dept-card");
      if (!cards) return;

      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="py-24 md:py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-16">
          WE ARE{" "}
          <span className="text-primary">GOOD AT</span>
        </h2>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departments.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="dept-card group relative bg-black p-8 border-2 border-[#fff] hover:border-primary brutalist-shadow-white hover:brutalist-shadow-hover transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-black" />
              </div>

              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-white mb-2">
                {name}
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
