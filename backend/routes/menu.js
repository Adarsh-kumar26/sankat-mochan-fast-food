const express = require("express");
const MenuItem = require("../models/MenuItem");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: anyone can browse the menu
router.get("/", async (req, res) => {
  const items = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });
  res.json(items);
});

// Admin only: add, update, delete menu items
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Could not create item", error: err.message });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Could not update item", error: err.message });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ message: "Item deleted" });
});

module.exports = router;
