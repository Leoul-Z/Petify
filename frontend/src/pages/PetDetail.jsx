import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing } from '../api/listings'
import { createOrder } from '../api/orders'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FDF5ED',
    color: '#482E1D',
    fontFamily: 'monospace',
  },
  main: {
    flex: 1,
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    padding: '30px 20px',
    boxSizing: 'border-box',
  },
  photo: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'cover',
    borderRadius: '20px',
    display: 'block',
    marginBottom: '30px',
  },
  photoPlaceholder: {
    width: '100%',
    height: '300px',
    borderRadius: '20px',
    backgroundColor: '#e8ddd5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#8D4F33',
    marginBottom: '30px',
  },
  name: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#482E1D',
    margin: '0 0 10px 0',
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    fontSize: '16px',
    color: '#6b4c3b',
    marginBottom: '16px',
  },
  metaItem: {
    backgroundColor: '#f0e6dc',
    borderRadius: '8px',
    padding: '4px 12px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#8D4F33',
    margin: '0 0 20px 0',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#482E1D',
    marginBottom: '20px',
  },
  sellerInfo: {
    fontSize: '14px',
    color: '#6b4c3b',
    marginBottom: '24px',
  },
  unavailableBanner: {
    backgroundColor: '#f5e0d5',
    border: '1px solid #c97a5a',
    borderRadius: '10px',
    padding: '14px 20px',
    color: '#8D4F33',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  adoptBtn: {
    backgroundColor: '#8D4F33',
    color: '#FDF5ED',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    fontFamily: 'inherit',
  },
  adoptBtnDisabled: {
    backgroundColor: '#c4a898',
    color: '#FDF5ED',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 36px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    fontFamily: 'inherit',
  },
  loadingText: {
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '20px',
    color: '#8D4F33',
  },
  notFoundText: {
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '24px',
    color: '#8D4F33',
    fontWeight: 'bold',
  },
  // Modal styles
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '440px',
    width: '90%',
    boxSizing: 'border-box',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#482E1D',
    margin: '0 0 20px 0',
  },
  modalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    color: '#482E1D',
    marginBottom: '10px',
  },
  modalDivider: {
    borderTop: '1px solid #e0d5cc',
    margin: '16px 0',
  },
  modalTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#482E1D',
    marginBottom: '24px',
  },
  modalBtnRow: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    backgroundColor: '#8D4F33',
    color: '#FDF5ED',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s ease',
  },
  confirmBtnLoading: {
    backgroundColor: '#c4a898',
    color: '#FDF5ED',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
    fontFamily: 'inherit',
  },
  cancelBtn: {
    backgroundColor: '#f0e6dc',
    color: '#482E1D',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s ease',
  },
  modalError: {
    color: '#c0392b',
    fontSize: '14px',
    marginBottom: '16px',
    backgroundColor: '#fdecea',
    borderRadius: '8px',
    padding: '10px 14px',
  },
}

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    setLoading(true)
    getListing(id)
      .then((data) => {
        if (!data || data.error || !data.id) {
          setNotFound(true)
        } else {
          setListing(data)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  function handleAdoptClick() {
    if (!user) {
      navigate('/login')
      return
    }
    setOrderError('')
    setModalOpen(true)
  }

  async function handleConfirmPay() {
    setOrderLoading(true)
    setOrderError('')
    try {
      const res = await createOrder(listing.id)
      if (res && res.id) {
        navigate('/orders')
      } else {
        setOrderError(res?.error || 'Payment failed. Please try again.')
      }
    } catch {
      setOrderError('An unexpected error occurred. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  function handleCloseModal() {
    if (orderLoading) return
    setModalOpen(false)
    setOrderError('')
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={styles.loadingText}>Loading pet details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound) {
    return (
      <div style={styles.page}>
        <main style={styles.main}>
          <p style={styles.notFoundText}>Pet not found.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const isUnavailable = listing.status === 'sold' || listing.status === 'deleted'

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        {/* Photo */}
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.name}
            style={styles.photo}
          />
        ) : (
          <div style={styles.photoPlaceholder} role="img" aria-label="No photo available">
            No photo available
          </div>
        )}

        {/* Name */}
        <h1 style={styles.name}>{listing.name}</h1>

        {/* Meta info */}
        <div style={styles.metaRow}>
          {listing.species && (
            <span style={styles.metaItem}>{listing.species}</span>
          )}
          {listing.breed && (
            <span style={styles.metaItem}>{listing.breed}</span>
          )}
          {listing.age_months != null && (
            <span style={styles.metaItem}>
              {listing.age_months} month{listing.age_months !== 1 ? 's' : ''} old
            </span>
          )}
        </div>

        {/* Price */}
        <p style={styles.price}>${Number(listing.price_usd).toFixed(2)}</p>

        {/* Description */}
        {listing.description && (
          <p style={styles.description}>{listing.description}</p>
        )}

        {/* Seller name (if available) */}
        {listing.seller_name && (
          <p style={styles.sellerInfo}>
            Listed by: <strong>{listing.seller_name}</strong>
          </p>
        )}

        {/* Unavailability banner */}
        {isUnavailable && (
          <div style={styles.unavailableBanner} role="alert">
            This pet is no longer available.
          </div>
        )}

        {/* Adopt / Buy button */}
        <button
          style={isUnavailable ? styles.adoptBtnDisabled : styles.adoptBtn}
          onClick={isUnavailable ? undefined : handleAdoptClick}
          disabled={isUnavailable}
          aria-disabled={isUnavailable}
        >
          Adopt / Buy
        </button>
      </main>

      <Footer />

      {/* Order summary modal */}
      {modalOpen && (
        <div
          style={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal() }}
        >
          <div style={styles.modal}>
            <h2 id="modal-title" style={styles.modalTitle}>Order Summary</h2>

            <div style={styles.modalRow}>
              <span>Pet</span>
              <span>{listing.name}</span>
            </div>
            <div style={styles.modalRow}>
              <span>Price</span>
              <span>${Number(listing.price_usd).toFixed(2)}</span>
            </div>

            <div style={styles.modalDivider} />

            <div style={styles.modalTotal}>
              <span>Total</span>
              <span>${Number(listing.price_usd).toFixed(2)}</span>
            </div>

            {orderError && (
              <div style={styles.modalError} role="alert">
                {orderError}
              </div>
            )}

            <div style={styles.modalBtnRow}>
              <button
                style={styles.cancelBtn}
                onClick={handleCloseModal}
                disabled={orderLoading}
              >
                Cancel
              </button>
              <button
                style={orderLoading ? styles.confirmBtnLoading : styles.confirmBtn}
                onClick={handleConfirmPay}
                disabled={orderLoading}
              >
                {orderLoading ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
