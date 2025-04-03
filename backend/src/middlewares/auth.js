import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to check if user is authenticated

export const isAuthenticated = (context) => {
  if (!context.user) {
    throw new Error("Unauthorized: You must be logged in!");
  }
};
export const isAuthorized = (context, requiredRole) => {
  if (!context.user) {
    throw new Error("Unauthorized: You must be logged in!");
  }

  if (context.user.role !== requiredRole) {
    throw new Error(
      `Forbidden: Only ${requiredRole}s can perform this action!`
    );
  }
};

// Middleware to check if user is an ADMIN
export const isAdmin = (context) => {
  const user = isAuthenticated(context);
  if (user.role !== "ADMIN") throw new Error("Access denied! Admins only.");
  return user;
};
