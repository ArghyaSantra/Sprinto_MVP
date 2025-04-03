import { prisma } from "../models/prismaClient.js";

// ✅ Get all policies
export const getPolicies = async (req, res) => {
  try {
    const policies = await prisma.policy.findMany({
      include: { assignments: true },
    });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create a policy
export const createPolicy = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newPolicy = await prisma.policy.create({
      data: { name, description },
    });
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
