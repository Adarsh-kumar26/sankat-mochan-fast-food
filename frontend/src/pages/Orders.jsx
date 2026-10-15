import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="center-msg">Loading orders...</p>;
  if (orders.length === 0) return <p className="center-msg">You have no orders yet.</p>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span>Order #{order._id.slice(-6).toUpperCase()}</span>
            <span className={`status status-${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus.replace("_", " ")}
            </span>
          </div>
          <ul>
            {order.items.map((i, idx) => (
              <li key={idx}>
                {i.name} x {i.quantity} — ₹{i.price * i.quantity}
              </li>
            ))}
          </ul>
          <div className="order-footer">
            <span>Total: ₹{order.totalAmount}</span>
            <span>
              Payment: {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
