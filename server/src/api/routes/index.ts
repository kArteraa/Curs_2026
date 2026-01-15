import { Router } from "express";
import destinationsRoutes from "./destinations.routes";
import tourPackagesRoutes from "./tour-packages.routes";

const router = Router();

router.use("/destinations", destinationsRoutes);
router.use("/tour-packages", tourPackagesRoutes);

export default router;
