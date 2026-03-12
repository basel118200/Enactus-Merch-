"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const phrases = [
  "Projects with purpose.",
  "Merch with identity.",
  "Students with vision.",
];

export default function BuiltDifferentSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = sectionRef.current?.querySelectorAll(".bd-line");
      if (!lines) return;

      lines.forEach((line) => {
        gsap.from(line, {
          y: 100,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
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
      id="built-different"
      className="py-32 md:py-48 bg-[#0a0a0a] border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs text-secondary uppercase tracking-[0.3em] mb-12">
          Built Different
        </p>

        <div className="space-y-6 md:space-y-8">
          {phrases.map((phrase, i) => (
            <div key={i} className="overflow-hidden">
              <h2 className="bd-line font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tight">
                {phrase.split(" ").map((word, wi) => (
                  <span key={wi}>
                    {wi === phrase.split(" ").length - 1 ? (
                      <span className="text-primary">{word}</span>
                    ) : (
                      word
                    )}{" "}
                  </span>
                ))}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
