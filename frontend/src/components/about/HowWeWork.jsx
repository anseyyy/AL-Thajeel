import SectionHead from "@/components/common/SectionHead";

const principles = [
  {
    num: "01",
    title: "Licensed & RERA registered",
    description:
      "Every transaction runs through proper Dubai Land Department channels.",
  },
  {
    num: "02",
    title: "Bilingual team",
    description:
      "Arabic and English support across every stage of a deal.",
  },
  {
    num: "03",
    title: "No surprise fees",
    description:
      "Commission and service charges are quoted upfront, in writing.",
  },
];

export default function HowWeWork() {
  return (
    <section className="w-full bg-[var(--panel)] border-y border-[var(--line)] py-[clamp(3rem,7vw,5.5rem)] px-[clamp(1.2rem,4vw,3rem)]">
      <div className="max-w-[1180px] mx-auto">
        <SectionHead title="How we work" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
          {principles.map((item) => (
            <div key={item.num} className="flex flex-col">
              <div className="text-[var(--accent)] font-serif text-[1.6rem] mb-2 font-bold">
                {item.num}
              </div>
              <h4 className="font-serif text-[1.1rem] font-semibold mb-1.5 text-[var(--ink)]">
                {item.title}
              </h4>
              <p className="text-[var(--sub)] text-[0.92rem] leading-[1.55] m-0">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
