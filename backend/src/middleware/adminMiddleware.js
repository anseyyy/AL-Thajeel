/**
 * Admin Authorization Middleware
 * Ensures the authenticated user has the 'admin' role
 */
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
};

export default adminMiddleware;
