export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">🍔 Sankat Mochan Fast Food</div>
          <p>Hot &amp; fresh fast food, delivered to your door.</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p>Open daily, 11 AM – 11 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Sankat Mochan Fast Food. All rights reserved.
      </div>
    </footer>
  );
}
