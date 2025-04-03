import express from "express";
import { getPolicies, createPolicy } from "../controllers/policyControllers.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getPolicies", isAuthenticated, getPolicies);
router.post("/createPolicy", isAuthenticated, isAdmin, createPolicy);

export default router;
