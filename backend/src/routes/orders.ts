import { Router } from "express"; const router = Router(); router.get("/health", (req, res) => { res.json({ message: "Orders routes - Coming in Phase 4" }); }); export default router;
