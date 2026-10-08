import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoute from "../routes/auth/authRoute.js";
import propertyRoute from "../routes/property/propertyRoute.js";
import adminPropertyRoute from "../routes/property/adminPropertyRoute.js";
import contactRoute from "../routes/contact/contactRoute.js";
import adminContactRoute from "../routes/contact/adminContactRoute.js";
import testimonialRoute from "../routes/testimonial/testimonialRoute.js";
import adminTestimonialRoute from "../routes/testimonial/adminTestimonialRoute.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Al Thajeel Real Estates API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/admin/properties", adminPropertyRoute);
app.use("/api/contact", contactRoute);
app.use("/api/admin/contacts", adminContactRoute);
app.use("/api/testimonials", testimonialRoute);
app.use("/api/admin/testimonials", adminTestimonialRoute);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
