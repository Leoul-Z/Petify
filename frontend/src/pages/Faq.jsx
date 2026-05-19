import { useState } from 'react'
import Footer from '../components/Footer'

const FAQ_ITEMS = [
  {
    question: 'How do I adopt a pet?',
    answer:
      'Browse our listings on the Shop page, click on a pet you love, and press "Adopt / Buy". You\'ll see an order summary before confirming. Once payment is processed, the seller will be notified and will reach out to arrange the handover.',
  },
  {
    question: 'How do I list my pet for sale?',
    answer:
      'Register for a Seller account (or select "Seller" when signing up), then head to your Dashboard. Fill in the listing form with your pet\'s details and a photo, and your listing will go live immediately after submission.',
  },
  {
    question: 'Is payment secure?',
    answer:
      'Yes. All payments on Petify are processed through our secure payment system. We never store your full card details, and every transaction is encrypted end-to-end.',
  },
  {
    question: 'Can I contact the seller?',
    answer:
      'After completing a purchase, the seller\'s contact information is shared with you so you can coordinate the handover. If you have questions before buying, you can reach out to our support team and we\'ll connect you.',
  },
  {
    question: 'What happens after I pay?',
    answer:
      'Once your payment is confirmed, the listing is marked as sold and the seller is notified. You\'ll also see the order in your Order History page. The seller will then contact you to arrange collection or delivery of your new companion.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = i => setOpenIndex(openIndex === i ? null : i)

  return (
    <div style={{ backgroundColor: '#FDF5ED', minHeight: '100vh', color: '#482E1D', fontFamily: 'system-ui, sans-serif' }}>
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#482E1D', margin: '0 0 40px 0' }}>
          Frequently Asked Questions
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(72,46,29,0.07)' }}
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#482E1D',
                  fontSize: '17px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                }}
              >
                {item.question}
                <span style={{ fontSize: '20px', marginLeft: '12px', flexShrink: 0, color: '#8D4F33' }}>
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>

              {openIndex === i && (
                <div style={{ padding: '0 24px 20px 24px', fontSize: '16px', color: '#6b4c3b', lineHeight: '1.7' }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
