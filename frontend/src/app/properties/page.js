import PropertiesHead from "@/components/properties/PropertiesHead";
import PropertyGrid from "@/components/properties/PropertyGrid";

export const metadata = {
  title: "Properties  Al Dhiyafah Properties",
  description:
    "Villas, flats, kiosks and warehouses across the Emirates. Filter by type.",
};

export default function PropertiesPage() {
  return (
    <section className="pt-[calc(6.4rem+env(safe-area-inset-top,0px))] pb-[clamp(3rem,7vw,5.5rem)] w-full">
      <div className="container-width container-padding-x">
        <PropertiesHead />
        <PropertyGrid />
      </div>
    </section>
  );
}
