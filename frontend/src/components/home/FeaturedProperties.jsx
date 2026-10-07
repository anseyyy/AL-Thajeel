import SectionHead from "@/components/common/SectionHead";
import PropertyCard from "@/components/common/PropertyCard";
import { properties } from "@/data/properties";

export default function FeaturedProperties() {
  const featured = properties.filter((p) => p.featured);

  return (
    <section className="py-[clamp(3rem,7vw,5.5rem)] px-[clamp(1.2rem,4vw,3rem)] max-w-[1180px] mx-auto w-full">
      <SectionHead
        title="Featured this week"
        description="A short list, kept current. Full details and viewings are arranged once you reach out."
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5.5">
        {featured.map((property) => (
          <PropertyCard
            key={property.id}
            type={property.type}
            tag={property.tag}
            title={property.title}
            price={property.price}
            description={property.description}
          />
        ))}
      </div>
    </section>
  );
}
