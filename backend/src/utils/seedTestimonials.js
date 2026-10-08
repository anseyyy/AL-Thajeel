import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "../db/dbConnect.js";
import Testimonial from "../models/Testimonial.js";

const sampleTestimonials = [
  {
    name: "Ahmed Al Mansoori",
    role: "Property Investor",
    message:
      "Al Thajeel made acquiring our Palm Jumeirah luxury villa seamless. Their market knowledge and transparent guidance from initial inspection to title deed transfer was second to none.",
    rating: 5,
    date: new Date("2026-08-15"),
    image: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: true,
    isPublished: true,
  },
  {
    name: "Sarah Jenkins",
    role: "Managing Director",
    message:
      "Securing our new corporate office in Business Bay through Al Thajeel was the best decision for our expansion. Professional, punctual, and highly attentive to every technical detail.",
    rating: 5,
    date: new Date("2026-09-02"),
    image: {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: true,
    isPublished: true,
  },
  {
    name: "Tariq Bin Rashid",
    role: "Private Homeowner",
    message:
      "We found our dream family home in Arabian Ranches with their expert help. The personalized walkthroughs and clear contract support gave our entire family complete peace of mind.",
    rating: 5,
    date: new Date("2026-09-18"),
    image: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: true,
    isPublished: true,
  },
  {
    name: "Elena Rostova",
    role: "International Buyer",
    message:
      "Relocating to Dubai was a huge step, but Al Thajeel handled our beachfront villa acquisition flawlessly. Exceptional responsiveness and world-class service throughout.",
    rating: 5,
    date: new Date("2026-09-28"),
    image: {
      url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: false,
    isPublished: true,
  },
  {
    name: "Marcus Vance",
    role: "Commercial Logistics Lead",
    message:
      "Finding a fully compliant industrial warehouse in Jebel Ali required deep regulatory insight. The Al Thajeel commercial team delivered precisely what we needed on schedule.",
    rating: 4,
    date: new Date("2026-10-01"),
    image: {
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: false,
    isPublished: true,
  },
  {
    name: "Fatima Al Zaabi",
    role: "Retail Entrepreneur",
    message:
      "Their prime retail commercial leasing advisory helped us land the perfect foot-traffic location in City Walk. I cannot recommend the Al Thajeel team highly enough.",
    rating: 5,
    date: new Date("2026-10-04"),
    image: {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      publicId: "",
    },
    isFeatured: false,
    isPublished: true,
  },
];

async function seedTestimonials() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for Testimonials cleanup and seeding...");

    // Clean up any old company & socialUrl fields
    await Testimonial.updateMany({}, { $unset: { company: "", socialUrl: "" } });

    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(sampleTestimonials);
      console.log(`Seeded ${sampleTestimonials.length} initial testimonials successfully.`);
    } else {
      console.log(`Database updated and cleaned. Currently has ${count} testimonials.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Testimonials Seeding Error:", error);
    process.exit(1);
  }
}

seedTestimonials();
