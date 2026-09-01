import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* ── Brand ── */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">🐾 PETIFY</Link>
          <p className="footer-tagline">
            The world's leading ethical pet marketplace.
            Every companion deserves a warm, loving home.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook" className="footer-social-link">
              <img src="/assets/facebook-boxed-svgrepo-com.svg" alt="Facebook" />
            </a>
            <a href="#" aria-label="Instagram" className="footer-social-link">
              <img src="/assets/instagram-svgrepo-com.svg" alt="Instagram" />
            </a>
            <a href="#" aria-label="WhatsApp" className="footer-social-link">
              <img src="/assets/whatsapp-svgrepo-com.svg" alt="WhatsApp" />
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="footer-links">
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/shop">Shop All Pets</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Account</h3>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact</h3>
            <ul>
              <li><a href="mailto:hello@petify.com">hello@petify.com</a></li>
              <li><a href="#">Support Center</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} Petify. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
