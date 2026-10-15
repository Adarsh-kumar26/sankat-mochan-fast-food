import { useEffect, useState } from "react";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    api
      .get("/menu")
      .then(({ data }) => setItems(data))
      .catch(() => setError("Could not load menu. Is the backend server running?"))
      .finally(() => setLoading(false));
  }, []);

  function handleAdd(item) {
    addToCart(item);
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 1000);
  }

  if (loading) return <p className="center-msg">Loading menu...</p>;
  if (error) return <p className="center-msg error">{error}</p>;

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      {categories.map((category) => (
        <div key={category} className="category-block">
          <h2>{category}</h2>
          <div className="item-grid">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <div key={item._id} className="item-card">
                  <h3>{item.name}</h3>
                  <p className="desc">{item.description}</p>
                  <div className="item-footer">
                    <span className="price">₹{item.price}</span>
                    <button onClick={() => handleAdd(item)}>
                      {addedId === item._id ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
