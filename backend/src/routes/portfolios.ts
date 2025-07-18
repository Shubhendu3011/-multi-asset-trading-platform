import { Router } from "express"; const router = Router(); router.get("/health", (req, res) => { res.json({ message: "Portfolios routes - Coming in Phase 4" }); }); export default router;
