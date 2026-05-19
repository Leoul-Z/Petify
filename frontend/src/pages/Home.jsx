import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

// NOTE: Copy the assets/ folder from the workspace root to frontend/public/assets/
// to display real pet images. Until then, placeholder coloured divs are shown.

const PET_IMAGES = [
  '/assets/alex-meier-KGiQFgF7dkc-unsplash.jpg',
  '/assets/baptist-standaert-mx0DEnfYxic-unsplash.jpg',
  '/assets/kabo-p6yH8VmGqxo-unsplash.jpg',
  '/assets/luiza-sayfullina-9giow4jXrzM-unsplash.jpg',
]

const PLACEHOLDER_COLORS = ['#e8ddd5', '#d4c4b5', '#c9b49a', '#b8a08a']

const FEATURES = [
  {
    icon: '✅',
    title: 'Verified Sellers',
    text: 'Every seller on Petify goes through a verification process so you can adopt with confidence.',
  },
  {
    icon: '🔒',
    title: 'Safe Adoption',
    text: 'Our secure payment and adoption process protects both buyers and sellers at every step.',
  },
  {
    icon: '🐾',
    title: 'Find Your Match',
    text: 'Browse hundreds of pets across dozens of species and find the companion that fits your life.',
  },
]

export default function Home() {
  return (
    <div style={{ backgroundColor: '#FDF5ED', minHeight: '100vh', color: '#482E1D', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Hero ── */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '60px 80px', gap: '40px', flexWrap: 'wrap' }}>

        {/* Left: heading + subtext + CTA */}
        <div style={{ flex: '1 1 340px', maxWidth: '520px' }}>
          <h1 style={{ fontSize: '52px', fontWeight: '800', color: '#482E1D', lineHeight: '1.15', margin: '0 0 20px 0' }}>
            Find Your New Family Member
          </h1>
          <p style={{ fontSize: '18px', color: '#6b4c3b', lineHeight: '1.6', margin: '0 0 36px 0' }}>
            The world's leading ethical pet marketplace. Every companion deserves a warm, loving home.
          </p>
          <Link
            to="/shop"
            style={{ display: 'inline-block', backgroundColor: '#8D4F33', color: '#FDF5ED', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}
          >
            Browse Pets
          </Link>
        </div>

        {/* Right: 2x2 pet image grid */}
        <div style={{ flex: '1 1 340px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '480px' }}>
          {PET_IMAGES.map((src, i) => (
            <PetImageCell key={src} src={src} index={i} fallbackColor={PLACEHOLDER_COLORS[i]} />
          ))}
        </div>
      </section>

      {/* ── Why Petify? ── */}
      <section style={{ backgroundColor: '#ffffff', padding: '60px 80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#482E1D', margin: '0 0 40px 0' }}>
          Why Petify?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              style={{ backgroundColor: '#FDF5ED', borderRadius: '16px', padding: '36px 28px', flex: '1 1 220px', maxWidth: '280px', boxShadow: '0 2px 8px rgba(72,46,29,0.08)' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#482E1D', margin: '0 0 10px 0' }}>{f.title}</h3>
              <p style={{ fontSize: '15px', color: '#6b4c3b', lineHeight: '1.6', margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Renders the real image; falls back to a coloured placeholder if the asset is missing
function PetImageCell({ src, index, fallbackColor }) {
  return (
    <img
      src={src}
      alt={`Pet ${index + 1}`}
      style={{ borderRadius: '16px', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', backgroundColor: fallbackColor }}
      onError={e => {
        e.currentTarget.style.visibility = 'hidden'
        e.currentTarget.parentElement.style.backgroundColor = fallbackColor
        e.currentTarget.parentElement.style.borderRadius = '16px'
        e.currentTarget.parentElement.style.aspectRatio = '1 / 1'
      }}
    />
  )
}
