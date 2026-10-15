import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        🍔 Sankat Mochan Fast Food
      </Link>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
        <Link to="/cart" className="cart-link">
          Cart{totalItems > 0 ? ` (${totalItems})` : ""}
        </Link>
        {user ? (
          <>
            <span className="greet">Hi, {user.name.split(" ")[0]}</span>
            <button className="link-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
