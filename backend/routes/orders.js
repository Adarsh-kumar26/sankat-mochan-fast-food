const express = require("express");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Place a new order (payment is simulated: ONLINE orders are marked PAID immediately)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, deliveryPhone } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ message: "Delivery address and phone are required" });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItemId) },
    });
    const menuById = new Map(menuItems.map((m) => [m._id.toString(), m]));

    let totalAmount = 0;
    const orderItems = items.map((i) => {
      const menuItem = menuById.get(i.menuItemId);
      if (!menuItem) throw new Error(`Menu item not found: ${i.menuItemId}`);
      const quantity = Math.max(1, Number(i.quantity) || 1);
      totalAmount += menuItem.price * quantity;
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      };
    });

    const isOnline = paymentMethod === "ONLINE";

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod: isOnline ? "ONLINE" : "COD",
      paymentStatus: isOnline ? "PAID" : "PENDING",
      deliveryAddress,
      deliveryPhone,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Could not place order", error: err.message });
  }
});

// Logged-in customer: their own order history
router.get("/my", requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: view all orders and update status
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email phone").sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;
