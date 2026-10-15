const ICONS = {
  Burger: "🍔",
  Pizza: "🍕",
  Momos: "🥟",
  Sides: "🍟",
  Rolls: "🌯",
  Beverages: "🥤",
};

export function iconFor(category) {
  return ICONS[category] || "🍴";
}
