import { Router } from "express"; const router = Router(); router.get("/health", (req, res) => { res.json({ message: "Watchlists routes - Coming in Phase 5" }); }); export default router;
