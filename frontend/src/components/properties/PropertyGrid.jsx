"use client";

import { useState } from "react";
import PropertyCard from "@/components/common/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { properties } from "@/data/properties";

export default function PropertyGrid() {
  const [filter, setFilter] = useState("all");

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((p) => p.type === filter);

  return (
    <>
      <PropertyFilters activeFilter={filter} onFilterChange={setFilter} />
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5.5"
        id="propertyGrid"
      >
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            type={property.type}
            tag={property.tag}
            title={property.title}
            price={property.price}
            description={property.shortDescription || property.description}
          />
        ))}
      </div>
    </>
  );
}
