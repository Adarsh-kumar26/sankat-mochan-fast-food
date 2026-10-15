const bcrypt = require("bcryptjs");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");

const menuItems = [
  { name: "Veg Burger", category: "Burger", price: 60, description: "Crispy veg patty burger with fresh veggies" },
  { name: "Paneer Burger", category: "Burger", price: 90, description: "Burger with grilled paneer patty" },
  { name: "Cheese Burst Burger", category: "Burger", price: 110, description: "Loaded with extra cheese" },
  { name: "Veg Pizza (7 inch)", category: "Pizza", price: 120, description: "Classic veg loaded pizza" },
  { name: "Paneer Tikka Pizza", category: "Pizza", price: 160, description: "Pizza topped with paneer tikka" },
  { name: "Veg Momos (8 pcs)", category: "Momos", price: 70, description: "Steamed veg momos with spicy chutney" },
  { name: "Fried Momos (8 pcs)", category: "Momos", price: 90, description: "Crispy fried momos" },
  { name: "French Fries", category: "Sides", price: 80, description: "Crispy golden fries" },
  { name: "Masala Fries", category: "Sides", price: 100, description: "Fries tossed in spicy masala" },
  { name: "Veg Roll", category: "Rolls", price: 60, description: "Rolled paratha with veg filling" },
  { name: "Paneer Roll", category: "Rolls", price: 90, description: "Rolled paratha with spiced paneer" },
  { name: "Cold Coffee", category: "Beverages", price: 60, description: "Chilled cold coffee" },
  { name: "Masala Cola", category: "Beverages", price: 40, description: "Spiced cola drink" },
];

async function seedDatabase() {
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItems);
  console.log(`Seeded ${menuItems.length} menu items.`);

  const adminEmail = "admin@sankatmochanfastfood.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Sankat Mochan Fast Food Admin",
      email: adminEmail,
      passwordHash,
      isAdmin: true,
    });
    console.log(`Admin user created -> email: ${adminEmail}, password: admin123`);
  } else {
    console.log("Admin user already exists, skipping.");
  }
}

// Run directly (`npm run seed`) against whatever MONGO_URI is configured in .env
if (require.main === module) {
  require("dotenv").config();
  const connectDB = require("../config/db");

  connectDB()
    .then(seedDatabase)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
