export default function Marquee() {
  const text =
    "ENACTUS CAIRO • MERCH DROP • STUDENT POWER • LIMITED EDITION • PROJECTS • BRANDING • HR • MULTIMEDIA • FINANCIAL • ";

  return (
    <div className="w-full overflow-hidden py-4 border-y border-border select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="font-heading text-sm md:text-base font-bold uppercase tracking-[0.2em] text-primary mx-4"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
