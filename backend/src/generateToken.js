import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role }, // Include role in token
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

export default generateToken;
