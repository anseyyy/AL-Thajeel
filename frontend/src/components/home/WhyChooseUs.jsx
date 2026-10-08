import SectionHead from "@/components/common/SectionHead";

const reasons = [
  {
    num: "01",
    title: "Verified listings only",
    description:
      "Every property is checked against Ejari and title deed records before it goes live.",
  },
  {
    num: "02",
    title: "We reply fast",
    description:
      "Average first response under two hours, seven days a week, in Arabic or English.",
  },
  {
    num: "03",
    title: "Plain-language deals",
    description:
      "Clear fee breakdowns and timelines before you sign anything.",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="container-width container-padding-x mb-20">
      <section className="bg-[var(--panel)] border-y border-[var(--line)] py-[clamp(3rem,7vw,5.5rem)]">
        <div className="container-padding-x">
          <SectionHead
            title="Why buyers work with us"
            description="Three things we do differently, in the order they usually matter."
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
            {reasons.map((item) => (
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
    </div>
  );
}
