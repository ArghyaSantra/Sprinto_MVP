// backend/index.js
import express from "express";
import cors from "cors"; // ✅ Import cors
import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { typeDefs } from "./schemas/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
import policyRoutes from "./routes/policyRoutes.js"; // ✅ Import policy routes
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes
import "./queues/notificationWorker.js"; // ✅ Import notification worker

dotenv.config(); // ✅ Load environment variables first

const app = express();
app.use(express.json());
app.use(cors()); // ✅ Ensure CORS is imported

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY; // ✅ Ensure SECRET_KEY is loaded

if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY is missing in environment variables!");
  process.exit(1); // ✅ Stop execution if SECRET_KEY is not set
}

// ✅ REST API Routes
app.use("/api/policies", policyRoutes);
app.use("/api/users", userRoutes); // ✅ Add user routes

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, SECRET_KEY);
      } catch (error) {
        console.error("❌ Invalid Token");
      }
    }
    return { prisma, user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000; // ✅ Use environment variable for PORT
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`)
  );
}

startServer();

/*import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schemas/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ REST API Routes
app.use("/api/policies", policyRoutes);

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, SECRET_KEY);
      } catch (error) {
        console.error("Invalid Token");
      }
    }
    return { prisma, user };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("🚀 Server running on http://localhost:4000/graphql")
  );
}

startServer();*/
