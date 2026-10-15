import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [error, setError] = useState("");

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");

    if (paymentMethod === "ONLINE") {
      setStatus("processing");
      // Simulated payment gateway delay. Swap this block for a real
      // Razorpay/UPI integration later without touching the rest of the flow.
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    try {
      const payload = {
        items: cart.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        paymentMethod,
        deliveryAddress: address,
        deliveryPhone: phone,
      };
      await api.post("/orders", payload);
      setStatus("success");
      clearCart();
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Could not place order");
    }
  }

  if (cart.length === 0 && status !== "success") {
    navigate("/cart");
    return null;
  }

  if (status === "success") {
    return (
      <div className="center-msg success-box">
        <h2>✅ Order Placed!</h2>
        <p>
          {paymentMethod === "ONLINE" ? "Payment successful. " : "Pay with cash on delivery. "}
          Redirecting to your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <form className="auth-form checkout-form" onSubmit={handlePlaceOrder}>
        <h2>Checkout</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Delivery Address
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          Contact Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>

        <fieldset className="payment-options">
          <legend>Payment Method</legend>
          <label className="radio-row">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="payment"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Pay Now (Demo Online Payment)
          </label>
        </fieldset>

        <div className="cart-total">
          <strong>Total: ₹{totalAmount}</strong>
        </div>

        <button type="submit" disabled={status === "processing"}>
          {status === "processing"
            ? "Processing payment..."
            : paymentMethod === "ONLINE"
            ? "Pay & Place Order"
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}
