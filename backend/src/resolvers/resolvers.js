import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import dotenv from "dotenv";
import redis from "../config/redisClient.js";
import { sendEmailNotification } from "../queues/notificationQueue.js";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const resolvers = {
  Query: {
    users: async (_parent, _args, { prisma }) => {
      return prisma.user.findMany();
    },
    /*policies: async (_parent, _args, { prisma }) => {
      return prisma.policy.findMany();
    },*/
    policies: async (_, __, { prisma, user }) => {
      isAuthenticated({ prisma, user });

      // Check if policies are cached in Redis
      const cachedPolicies = await redis.get("policies");
      if (cachedPolicies) {
        return JSON.parse(cachedPolicies);
      }
      return await prisma.policy.findMany({
        include: { assignments: true },
      });
    },
    policy: async (_, { id }, { prisma }) => {
      return await prisma.policy.findUnique({
        where: { id },
        include: { assignments: true },
      });
    },
    assignments: async (_, __, { prisma }) => {
      return await prisma.policyAssignment.findMany({
        include: { user: true, policy: true },
      });
    },
  },
  Mutation: {
    createUser: async (_parent, args, { prisma }) => {
      const { name, email, password, role } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      return await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "USER", // Default to USER if no role is provided
        },
      });
    },
    createPolicy: async (_parent, args, { prisma, user }) => {
      isAuthorized({ prisma, user }, "ADMIN"); // Only Admins can create policies

      return prisma.policy.create({ data: args });
    },
    signup: async (_, { name, email, password, role }, { prisma }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "7d",
      });

      return { token, user };
    },
    login: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found!");

      console.log({ password, user_password: user.password });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password!");

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "7d",
      });

      return { token, user };
    },
    updatePolicy: async (
      _,
      { id, title, description, status },
      { prisma, user }
    ) => {
      isAuthorized({ prisma, user }, "ADMIN"); // Only Admins can update policies
      return await prisma.policy.update({
        where: { id },
        data: { title, description, status },
      });
    },
    deletePolicy: async (_, { id }, { prisma, user }) => {
      isAuthorized({ prisma, user }, "ADMIN"); // Only Admins can delete policies
      await prisma.policy.delete({ where: { id } });
      return "Policy deleted successfully";
    },
    sendNotification: async (_, { email, message }) => {
      await sendEmailNotification(email, message);
      return { success: true, message: "Notification job added to queue!" };
    },
  },
  PolicyAssignment: {
    user: (parent, _args, { prisma }) => {
      return prisma.user.findUnique({ where: { id: parent.userId } });
    },
    policy: (parent, _args, { prisma }) => {
      return prisma.policy.findUnique({ where: { id: parent.policyId } });
    },
  },
};
