import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="center-msg">
        <p>Your cart is empty.</p>
        <Link to="/">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.menuItemId} className="cart-row">
            <span className="cart-name">{item.name}</span>
            <div className="qty-control">
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}>+</button>
            </div>
            <span className="cart-price">₹{item.price * item.quantity}</span>
            <button className="remove-btn" onClick={() => removeFromCart(item.menuItemId)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <strong>Total: ₹{totalAmount}</strong>
      </div>
      <button className="checkout-btn" onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </button>
    </div>
  );
}
