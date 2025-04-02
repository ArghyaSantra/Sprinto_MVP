import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Replace with env variable later

export const resolvers = {
  Query: {
    users: async (_parent, _args, { prisma }) => {
      return prisma.user.findMany();
    },
    policies: async (_parent, _args, { prisma }) => {
      return prisma.policy.findMany();
    },
  },
  Mutation: {
    createUser: async (_parent, args, { prisma }) => {
      return prisma.user.create({ data: args });
    },
    createPolicy: async (_parent, args, { prisma }) => {
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

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password!");

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "7d",
      });

      return { token, user };
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
