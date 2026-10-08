import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a user
 * @param {string} userId - Mongo user ID
 * @param {string} role - User role (user | admin)
 * @returns {string} JWT Token
 */
export const generateToken = (userId, role = "user") => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "al_thajeel_secret_key_default",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export default generateToken;
