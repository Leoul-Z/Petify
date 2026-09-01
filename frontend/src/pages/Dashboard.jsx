import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getListings, createListing, updateListing, deleteListing } from '../api/listings'
import { getSellerOrders } from '../api/orders'
import Footer from '../components/Footer'
import './Dashboard.css'

const EMPTY_FORM = {
  name: '',
  species: '',
  breed: '',
  age_months: '',
  price_usd: '',
  description: '',
  photo_url: '',
}

export default function Dashboard() {
  const { user } = useAuth()

  // Form state
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [photoFileError, setPhotoFileError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Data state
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    fetchListings()
    fetchOrders()
  }, [])

  async function fetchListings() {
    setLoadingListings(true)
    const data = await getListings()
    setListings(Array.isArray(data) ? data : [])
    setLoadingListings(false)
  }

  async function fetchOrders() {
    setLoadingOrders(true)
    const data = await getSellerOrders()
    setOrders(Array.isArray(data) ? data : [])
    setLoadingOrders(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setPhotoFileError('Only JPEG, PNG, or WEBP images are allowed.')
      setForm((prev) => ({ ...prev, photo_url: '' }))
      return
    }

    setPhotoFileError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, photo_url: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function populateFormForEdit(listing) {
    setForm({
      name: listing.name || '',
      species: listing.species || '',
      breed: listing.breed || '',
      age_months: listing.age_months != null ? String(listing.age_months) : '',
      price_usd: listing.price_usd != null ? String(listing.price_usd) : '',
      description: listing.description || '',
      photo_url: listing.photo_url || '',
    })
    setEditingId(listing.id)
    setFieldErrors({})
    setGeneralError('')
    setPhotoFileError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFieldErrors({})
    setGeneralError('')
    setPhotoFileError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError('')
    setSubmitting(true)

    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed,
      age_months: Number(form.age_months),
      price_usd: Number(form.price_usd),
      description: form.description,
      photo_url: form.photo_url,
    }

    let res
    if (editingId) {
      res = await updateListing(editingId, payload)
    } else {
      res = await createListing(payload)
    }

    setSubmitting(false)

    if (res && res.errors) {
      setFieldErrors(res.errors)
      return
    }

    if (res && res.error) {
      setGeneralError(res.error)
      return
    }

    // Success
    setForm(EMPTY_FORM)
    setEditingId(null)
    await fetchListings()
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    await deleteListing(id)
    await fetchListings()
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString()
  }

  function formatPrice(price) {
    return `Br ${Number(price).toFixed(2)}`
  }

  return (
    <div className="dash-page">
      <div className="dash-main">
        
        <header className="dash-header">
          <h1 className="dash-title">Seller Dashboard</h1>
          {user && (
            <div className="dash-welcome">
              Welcome, {user.full_name}
            </div>
          )}
        </header>

        {/* ── SECTION 1: Create / Edit Listing Form ── */}
        <section className="dash-section">
          <h2 className="dash-section-heading">
            {editingId ? 'Edit Listing' : 'Create New Listing'}
          </h2>

          <div className="dash-form-card">
            <form onSubmit={handleSubmit} className="dash-form">
              {generalError && (
                <div className="dash-general-error">{generalError}</div>
              )}

              {/* Pet Name */}
              <label className="dash-label">
                Pet Name *
                <input
                  className="dash-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Buddy"
                />
                {fieldErrors.name && (
                  <span className="dash-field-error">{fieldErrors.name}</span>
                )}
              </label>

              {/* Species */}
              <label className="dash-label">
                Species *
                <input
                  className="dash-input"
                  type="text"
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dog"
                />
                {fieldErrors.species && (
                  <span className="dash-field-error">{fieldErrors.species}</span>
                )}
              </label>

              {/* Breed */}
              <label className="dash-label">
                Breed *
                <input
                  className="dash-input"
                  type="text"
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Golden Retriever"
                />
                {fieldErrors.breed && (
                  <span className="dash-field-error">{fieldErrors.breed}</span>
                )}
              </label>

              {/* Age in months */}
              <label className="dash-label">
                Age (months) *
                <input
                  className="dash-input"
                  type="number"
                  name="age_months"
                  value={form.age_months}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 6"
                />
                {fieldErrors.age_months && (
                  <span className="dash-field-error">{fieldErrors.age_months}</span>
                )}
              </label>

              {/* Price */}
              <label className="dash-label">
                Price (Br) *
                <input
                  className="dash-input"
                  type="number"
                  name="price_usd"
                  value={form.price_usd}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 250.00"
                />
                {fieldErrors.price_usd && (
                  <span className="dash-field-error">{fieldErrors.price_usd}</span>
                )}
              </label>

              {/* Photo upload */}
              <label className="dash-label">
                Photo (JPEG / PNG / WEBP)
                <input
                  className="dash-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                />
                {photoFileError && (
                  <span className="dash-field-error">{photoFileError}</span>
                )}
                {form.photo_url && (
                  <img src={form.photo_url} alt="Preview" className="dash-photo-preview" />
                )}
              </label>

              {/* Description */}
              <label className="dash-label dash-form-full">
                Description (max 500 chars)
                <textarea
                  className="dash-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="Tell buyers about this pet…"
                />
                <span className="dash-char-count">
                  {form.description.length}/500
                </span>
                {fieldErrors.description && (
                  <span className="dash-field-error">{fieldErrors.description}</span>
                )}
              </label>

              {/* Actions */}
              <div className="dash-form-actions">
                <button className="dash-submit-btn" type="submit" disabled={submitting}>
                  {submitting ? 'Saving…' : editingId ? 'Update Listing' : 'Create Listing'}
                </button>
                {editingId && (
                  <button
                    className="dash-cancel-btn"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* ── SECTION 2: My Listings Table ── */}
        <section className="dash-section">
          <h2 className="dash-section-heading">My Listings</h2>

          <div className="dash-table-wrap">
            {loadingListings ? (
              <div className="dash-empty" style={{padding: '24px'}}>Loading listings…</div>
            ) : listings.length === 0 ? (
              <div className="dash-empty" style={{padding: '24px'}}>No listings yet.</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Age</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        {listing.photo_url ? (
                          <img
                            src={listing.photo_url}
                            alt={listing.name}
                            className="dash-thumbnail"
                          />
                        ) : (
                          <div className="dash-thumbnail-placeholder">🐶</div>
                        )}
                      </td>
                      <td style={{fontWeight: '600'}}>{listing.name}</td>
                      <td>{listing.species}</td>
                      <td>{listing.breed}</td>
                      <td>{listing.age_months} mo</td>
                      <td style={{fontWeight: '600', color: '#8D4F33'}}>{formatPrice(listing.price_usd)}</td>
                      <td>
                        <span className={`dash-badge dash-badge-${listing.status || 'default'}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="dash-edit-btn"
                          onClick={() => populateFormForEdit(listing)}
                        >
                          Edit
                        </button>
                        <button
                          className="dash-delete-btn"
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ── SECTION 3: My Orders Table ── */}
        <section className="dash-section">
          <h2 className="dash-section-heading">My Orders</h2>

          <div className="dash-table-wrap">
            {loadingOrders ? (
              <div className="dash-empty" style={{padding: '24px'}}>Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="dash-empty" style={{padding: '24px'}}>No orders yet.</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Pet Name</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Buyer Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{fontWeight: '600'}}>{order.pet_name || '—'}</td>
                      <td style={{fontWeight: '600', color: '#8D4F33'}}>{formatPrice(order.price_paid ?? order.price)}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>{order.buyer_name || '—'}</td>
                      <td>
                        <span className={`dash-badge dash-badge-${order.status || 'default'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
