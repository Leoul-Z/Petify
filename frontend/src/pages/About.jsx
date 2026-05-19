import Footer from '../components/Footer'

export default function About() {
  return (
    <div style={{ backgroundColor: '#FDF5ED', minHeight: '100vh', color: '#482E1D', fontFamily: 'system-ui, sans-serif' }}>
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#482E1D', margin: '0 0 24px 0' }}>
          About Petify
        </h1>

        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#6b4c3b', marginBottom: '24px' }}>
          Petify is the world's leading ethical pet marketplace, built on the belief that every
          companion deserves a warm, loving home. We connect responsible sellers with caring buyers
          to make pet adoption safe, transparent, and joyful.
        </p>

        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#6b4c3b', marginBottom: '24px' }}>
          Our mission is simple: make it easy for people to find the perfect pet while ensuring
          every animal is treated with dignity and respect. We verify all sellers on our platform,
          provide secure payment processing, and offer support throughout the entire adoption journey.
        </p>

        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#6b4c3b', marginBottom: '24px' }}>
          Whether you're looking for a playful puppy, a calm cat, or something a little more
          exotic, Petify has hundreds of listings from trusted sellers across the country. Start
          browsing today and find your new family member.
        </p>

        <div style={{ marginTop: '40px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(72,46,29,0.08)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#482E1D', margin: '0 0 16px 0' }}>Our Values</h2>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {[
              'Ethical treatment of all animals',
              'Transparency between buyers and sellers',
              'Secure and trustworthy transactions',
              'A community built on compassion',
            ].map(v => (
              <li key={v} style={{ fontSize: '16px', color: '#6b4c3b', lineHeight: '1.8', marginBottom: '8px' }}>{v}</li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
