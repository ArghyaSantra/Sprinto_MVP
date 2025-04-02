// backend/index.js
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schemas/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();
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

startServer();
