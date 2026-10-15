import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";
import { iconFor } from "../categoryIcons.js";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    api
      .get("/menu")
      .then(({ data }) => setItems(data))
      .catch(() => setError("Could not load menu. Is the backend server running?"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, search]);

  function quantityInCart(itemId) {
    return cart.find((i) => i.menuItemId === itemId)?.quantity || 0;
  }

  if (loading) return <p className="center-msg">Loading menu...</p>;
  if (error) return <p className="center-msg error">{error}</p>;

  const groups =
    activeCategory === "All"
      ? categories
      : categories.filter((c) => c === activeCategory);

  return (
    <div className="menu-page">
      <section className="hero">
        <h1>Sankat Mochan Fast Food</h1>
        <p>Hot, fresh &amp; fast — straight to your door.</p>
        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search for burgers, pizza, momos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="chip-row">
        <button
          className={`chip ${activeCategory === "All" ? "chip-active" : ""}`}
          onClick={() => setActiveCategory("All")}
        >
          🍽️ All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${activeCategory === category ? "chip-active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {iconFor(category)} {category}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="center-msg">No items match your search.</p>
      )}

      {groups.map((category) => {
        const categoryItems = filteredItems.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;
        return (
          <div key={category} className="category-block">
            <h2>
              {iconFor(category)} {category}
            </h2>
            <div className="item-grid">
              {categoryItems.map((item) => {
                const qty = quantityInCart(item._id);
                return (
                  <div key={item._id} className="item-card">
                    <div className="item-media">
                      <span>{iconFor(item.category)}</span>
                    </div>
                    <div className="item-body">
                      <div className="item-top">
                        <span className="veg-dot" />
                        <h3>{item.name}</h3>
                      </div>
                      <p className="desc">{item.description}</p>
                      <div className="item-footer">
                        <span className="price">₹{item.price}</span>
                        {qty === 0 ? (
                          <button className="add-btn" onClick={() => addToCart(item)}>
                            ADD
                          </button>
                        ) : (
                          <div className="qty-control qty-control-card">
                            <button onClick={() => updateQuantity(item._id, qty - 1)}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => updateQuantity(item._id, qty + 1)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
