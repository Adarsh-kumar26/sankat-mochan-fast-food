import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
  const [error, setError] = useState("");

  function loadMenu() {
    api.get("/menu").then(({ data }) => setItems(data));
  }

  function loadOrders() {
    api.get("/orders").then(({ data }) => setOrders(data));
  }

  useEffect(() => {
    loadMenu();
    loadOrders();
  }, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleAddItem(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/menu", { ...form, price: Number(form.price) });
      setForm({ name: "", description: "", price: "", category: "" });
      loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add item");
    }
  }

  async function handleDeleteItem(id) {
    await api.delete(`/menu/${id}`);
    loadMenu();
  }

  async function handleStatusChange(orderId, orderStatus) {
    await api.put(`/orders/${orderId}/status`, { orderStatus });
    loadOrders();
  }

  const statuses = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      <section>
        <h2>Add Menu Item</h2>
        <form className="admin-form" onSubmit={handleAddItem}>
          {error && <p className="error">{error}</p>}
          <input placeholder="Name" value={form.name} onChange={update("name")} required />
          <input placeholder="Category" value={form.category} onChange={update("category")} required />
          <input
            placeholder="Price"
            type="number"
            min="0"
            value={form.price}
            onChange={update("price")}
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={update("description")}
          />
          <button type="submit">Add Item</button>
        </form>
      </section>

      <section>
        <h2>Current Menu</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>
                  <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>All Orders</h2>
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>
                #{order._id.slice(-6).toUpperCase()} — {order.user?.name} ({order.user?.phone})
              </span>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <ul>
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.name} x {i.quantity}
                </li>
              ))}
            </ul>
            <div className="order-footer">
              <span>Total: ₹{order.totalAmount}</span>
              <span>
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
