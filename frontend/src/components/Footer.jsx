import { Link } from 'react-router-dom'

const styles = {
  footer: {
    backgroundColor: '#482E1D',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '30px 60px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  rightDiv: {},
  rightDivP: {
    color: 'rgba(255,255,255,0.5)',
  },
  logo: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    color: '#ffffff',
  },
  imageRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  socialImg: {
    width: '30px',
    height: '30px',
    filter: 'brightness(0) invert(1)',
  },
  leftDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: '10px',
  },
  dimLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
  },
  h3: {
    margin: '0 0 10px 0',
    color: '#ffffff',
  },
}

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.rightDiv}>
        <h1 style={styles.logo}>PETIFY</h1>
        <p style={styles.rightDivP}>
          The world's leading ethical pet marketplace.{' '}
          Every companion deserves a warm, loving home.
        </p>
        <div style={styles.imageRow}>
          <a href="#" aria-label="Facebook">
            <img src="/assets/facebook-boxed-svgrepo-com.svg" alt="Facebook" style={styles.socialImg} />
          </a>
          <a href="#" aria-label="Instagram">
            <img src="/assets/instagram-svgrepo-com.svg" alt="Instagram" style={styles.socialImg} />
          </a>
          <a href="#" aria-label="WhatsApp">
            <img src="/assets/whatsapp-svgrepo-com.svg" alt="WhatsApp" style={styles.socialImg} />
          </a>
        </div>
      </div>

      <div style={styles.leftDiv}>
        <div>
          <ul style={styles.ul}>
            <li style={styles.li}><h3 style={styles.h3}>Quick Links</h3></li>
            <li style={styles.li}>
              <Link to="/shop" style={styles.dimLink}>Shop All Pets</Link>
            </li>
            <li style={styles.li}>
              <Link to="/about" style={styles.dimLink}>Our Story</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul style={styles.ul}>
            <li style={styles.li}><h3 style={styles.h3}>Help</h3></li>
            <li style={styles.li}>
              <Link to="/faq" style={styles.dimLink}>FAQs</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
