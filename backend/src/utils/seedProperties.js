import mongoose from "mongoose";
import "dotenv/config";
import Property from "../models/Property.js";
import connectDB from "../db/dbConnect.js";

const sampleProperties = [
  {
    title: "Palm Jumeirah Signature Villa",
    slug: "palm-jumeirah-villa",
    propertyType: "villa",
    purpose: "sale",
    status: "active",
    price: 8900000,
    priceLabel: "AED 8,900,000 · 5 bed",
    currency: "AED",
    bedrooms: 5,
    bathrooms: 6,
    area: 8200,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Palm Jumeirah",
      address: "Frond N, Palm Jumeirah",
    },
    photosCount: 6,
    description:
      "Exclusive beachfront villa in Palm Jumeirah with private pool, landscaped garden, and uninterrupted views of the Atlantis. This exceptional residence offers spacious living areas, premium finishes, and direct beach access — perfect for luxurious family living.",
    features: [
      "Beachfront frontage",
      "Private infinity pool",
      "Atlantis views",
      "Landscaped garden",
      "Maid's quarters",
      "Covered 3-car parking",
    ],
    isFeatured: true,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_2",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_3",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_4",
        order: 3,
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_5",
        order: 4,
      },
      {
        url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_pj_6",
        order: 5,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_pj_1",
    },
  },
  {
    title: "Al Barsha Family Villa",
    slug: "al-barsha-family-villa",
    propertyType: "villa",
    purpose: "sale",
    status: "active",
    price: 4200000,
    priceLabel: "AED 4,200,000 · 4 bed",
    currency: "AED",
    bedrooms: 4,
    bathrooms: 5,
    area: 5400,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Al Barsha 2",
      address: "Al Barsha 2, Dubai",
    },
    description:
      "Spacious family residence located in the heart of Al Barsha. Offers peaceful gated living with a private swimming pool, mature garden, separate maid's quarters, and quick access to top international schools.",
    features: [
      "Gated community",
      "Private swimming pool",
      "Maids and driver quarters",
      "Close to international schools",
      "Covered 2-car garage",
      "Modern kitchen appliances",
    ],
    isFeatured: true,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ab_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ab_2",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ab_3",
        order: 2,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_ab_1",
    },
  },
  {
    title: "Arabian Ranches House",
    slug: "arabian-ranches-house",
    propertyType: "house",
    purpose: "sale",
    status: "active",
    price: 3600000,
    priceLabel: "AED 3,600,000 · 3 bed",
    currency: "AED",
    bedrooms: 3,
    bathrooms: 4,
    area: 3800,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Arabian Ranches",
      address: "Al Reem, Arabian Ranches",
    },
    description:
      "Charming family villa situated on a quiet cul-de-sac in Arabian Ranches. Features a landscaped private garden, bright open-plan living and dining areas, and access to world-class community golf courses.",
    features: [
      "Private landscaped garden",
      "Quiet cul-de-sac location",
      "Community golf club access",
      "Built-in wardrobes",
      "Children play areas nearby",
      "24/7 community security",
    ],
    isFeatured: true,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ar_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ar_2",
        order: 1,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_ar_1",
    },
  },
  {
    title: "Downtown Dubai Burj View Flat",
    slug: "downtown-dubai-flat",
    propertyType: "apartment",
    purpose: "sale",
    status: "active",
    price: 1650000,
    priceLabel: "AED 1,650,000 · 2 bed",
    currency: "AED",
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Downtown Dubai",
      address: "Opera District, Downtown Dubai",
    },
    description:
      "Spectacular high-floor apartment offering direct views of the Burj Khalifa and Dubai Fountain. Steps away from Dubai Mall, fine dining restaurants, and metro access.",
    features: [
      "Burj Khalifa view",
      "Walking distance to Dubai Mall",
      "Shared infinity pool & gym",
      "High-speed elevators",
      "Concierge and valet parking",
      "Floor-to-ceiling windows",
    ],
    isFeatured: false,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_dd_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_dd_2",
        order: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_dd_3",
        order: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_dd_4",
        order: 3,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_dd_1",
    },
  },
  {
    title: "Business Bay Fitted Commercial Office",
    slug: "business-bay-office",
    propertyType: "office",
    purpose: "rent",
    status: "active",
    price: 145000,
    priceLabel: "AED 145,000 / year",
    currency: "AED",
    bedrooms: 0,
    bathrooms: 2,
    area: 1450,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Business Bay",
      address: "Bay Square, Business Bay",
    },
    description:
      "Fully fitted commercial office space with executive conference rooms, manager cabins, pantry, and stunning canal views. Complete with 2 allocated parking bays and high-speed fiber optics.",
    features: [
      "Fully fitted and partitioned",
      "Dubai Canal views",
      "Conference room & executive suites",
      "Pantry & private washrooms",
      "2 dedicated parking bays",
      "Close to Business Bay Metro",
    ],
    isFeatured: false,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_bb_1",
        order: 0,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_bb_1",
    },
  },
  {
    title: "Mall of the Emirates Retail Kiosk",
    slug: "mall-of-the-emirates-shop",
    propertyType: "shop",
    purpose: "rent",
    status: "active",
    price: 18000,
    priceLabel: "AED 18,000 / month",
    currency: "AED",
    bedrooms: 0,
    bathrooms: 1,
    area: 130,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Al Barsha",
      address: "Ground Floor, Mall of the Emirates",
    },
    description:
      "High-footfall prime retail kiosk/shop space inside Mall of the Emirates. Fully fitted counter space, digital display hooks, and high-visibility corridor location.",
    features: [
      "High daily footfall atrium",
      "Pre-approved retail fit-out",
      "Digital signage connections",
      "3-phase electrical supply",
      "Central air-conditioned mall",
      "Direct mall security & cleaning",
    ],
    isFeatured: false,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_moe_1",
        order: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_moe_2",
        order: 1,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_moe_1",
    },
  },
  {
    title: "Jebel Ali Staff Accommodation Camp",
    slug: "jebel-ali-staff-camp",
    propertyType: "labour",
    purpose: "rent",
    status: "active",
    price: 55000,
    priceLabel: "AED 55,000 / month",
    currency: "AED",
    bedrooms: 40,
    bathrooms: 20,
    area: 14500,
    areaUnit: "sq.ft",
    location: {
      emirate: "Dubai",
      city: "Dubai",
      community: "Jebel Ali Industrial",
      address: "Jebel Ali Industrial Area 1",
    },
    description:
      "Fully compliant Civil Defense approved staff accommodation camp in Jebel Ali Industrial Area. Equipped with large dining hall/mess, commercial laundry, prayer room, and 24/7 security.",
    features: [
      "Civil Defense & MOHRE approved",
      "Commercial dining & mess hall",
      "Central AC throughout",
      "Dedicated laundry & wash facilities",
      "24/7 on-site security & CCTV",
      "Ample bus parking bay",
    ],
    isFeatured: false,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_ja_1",
        order: 0,
      },
    ],
    coverImage: {
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      publicId: "seed_ja_1",
    },
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for property seed.");

    for (const prop of sampleProperties) {
      await Property.findOneAndUpdate(
        { slug: prop.slug },
        { $set: prop },
        { upsert: true, new: true }
      );
      console.log(`Seeded property: ${prop.title}`);
    }

    console.log("Property seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
