import SectionHead from "@/components/common/SectionHead";

const stats = [
  { value: "11", label: "years in the UAE market" },
  { value: "1,200+", label: "properties placed" },
  { value: "3", label: "emirates covered" },
  { value: "4.8", label: "average client rating" },
];

export default function AboutHead() {
  return (
    <section className="pt-[calc(6.4rem+env(safe-area-inset-top,0px))] pb-[clamp(3rem,7vw,5.5rem)] px-[clamp(1.2rem,4vw,3rem)] max-w-[1180px] mx-auto w-full">
      <SectionHead
        title="About Al Dhiyafah"
        description="A UAE-based brokerage working across Dubai, Abu Dhabi and Sharjah since 2014."
      />
      <p className="max-w-[640px] text-[var(--sub)] leading-[1.7] text-[0.95rem] mb-8">
        We started as a two-person office in Deira matching families to their first
        flat. Today we handle residential, retail and industrial property across
        the Emirates — but we still pick up the phone ourselves, and we still walk
        every listing before it goes on the site.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5.5 mt-9.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <b className="block font-serif text-[2rem] text-[var(--accent)] font-bold">
              {stat.value}
            </b>
            <span className="text-[var(--sub)] text-[0.86rem]">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
