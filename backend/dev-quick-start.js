// Quick Test Mode: spins up a temporary in-memory MongoDB so you can test the
// app with zero setup (no Atlas signup, no local MongoDB install). Data resets
// every time you stop this process (Ctrl+C) - fine for testing, not for real use.
const { MongoMemoryServer } = require("mongodb-memory-server");

async function main() {
  const mongod = await MongoMemoryServer.create();

  process.env.MONGO_URI = mongod.getUri("sankat_mochan_fast_food");
  process.env.JWT_SECRET = process.env.JWT_SECRET || "quick-test-secret-not-for-production";
  process.env.AUTO_SEED = "true";

  console.log("================================================");
  console.log(" Sankat Mochan Fast Food - QUICK TEST MODE");
  console.log(" Temporary database started (data resets on stop)");
  console.log(" Admin login: admin@sankatmochanfastfood.com / admin123");
  console.log("================================================");

  require("./server");

  process.on("SIGINT", async () => {
    await mongod.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Quick Test Mode failed to start:", err);
  process.exit(1);
});
