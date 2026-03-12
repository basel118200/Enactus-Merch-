"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    const status = statusRef.current;

    if (!overlay || !counter || !bar || !status) return;

    const statuses = ["Preparing experience", "Loading assets", "Almost there"];
    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlay, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => setDone(true),
        });
      },
    });


    tl.to(obj, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(obj.val);
        counter.textContent = `${v.toString().padStart(2, "0")}%`;
        bar.style.width = `${v}%`;

        if (v < 40) {
          status.textContent = statuses[0];
        } else if (v < 80) {
          status.textContent = statuses[1];
        } else {
          status.textContent = statuses[2];
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-[0.2em] text-white uppercase mb-2">
        ENACTUS CAIRO
      </h1>
      <p className="font-heading text-lg md:text-xl font-bold text-primary uppercase tracking-[0.15em] mb-4">
        20 Years of Impact
      </p>
      <p className="font-mono text-xs text-secondary tracking-widest mb-8">
        Loading...
      </p>

      <div className="w-64 md:w-80 flex flex-col items-center gap-4">
        <span
          ref={counterRef}
          className="font-mono text-5xl md:text-7xl font-bold text-primary tabular-nums"
        >
          00%
        </span>

        <div className="w-full h-[2px] bg-border rounded overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-primary rounded"
            style={{ width: "0%" }}
          />
        </div>


        <span
          ref={statusRef}
          className="font-mono text-xs text-secondary uppercase tracking-wider"
        >
          Preparing experience
        </span>

        <p className="font-mono text-sm text-white uppercase tracking-[0.3em] mt-12 opacity-80">
          Developed by Basel Bahaa
        </p>
      </div>
    </div>
  );
}
