import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getListings, createListing, updateListing, deleteListing } from '../api/listings'
import { getSellerOrders } from '../api/orders'
import Footer from '../components/Footer'

const styles = {
  page: {
    backgroundColor: '#FDF5ED',
    minHeight: '100vh',
    fontFamily: 'monospace',
    color: '#482E1D',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '30px 40px',
  },
  sectionHeading: {
    color: '#482E1D',
    fontFamily: 'monospace',
    fontSize: '22px',
    marginBottom: '16px',
    borderBottom: '2px solid #8D4F33',
    paddingBottom: '8px',
  },
  section: {
    marginBottom: '48px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    maxWidth: '800px',
  },
  formFullRow: {
    gridColumn: '1 / -1',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
    color: '#482E1D',
  },
  input: {
    padding: '10px',
    background: '#FDF5ED',
    border: '1px solid #c9b49a',
    borderRadius: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#482E1D',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    background: '#FDF5ED',
    border: '1px solid #c9b49a',
    borderRadius: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#482E1D',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  fileInput: {
    padding: '6px',
    background: '#FDF5ED',
    border: '1px solid #c9b49a',
    borderRadius: '10px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#482E1D',
    cursor: 'pointer',
  },
  submitBtn: {
    background: '#8D4F33',
    color: '#FDF5ED',
    borderRadius: '7px',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
  cancelBtn: {
    background: '#aaa',
    color: '#fff',
    borderRadius: '7px',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '14px',
    alignSelf: 'flex-start',
    marginLeft: '10px',
  },
  fieldError: {
    color: '#c0392b',
    fontSize: '11px',
    marginTop: '2px',
  },
  generalError: {
    color: '#c0392b',
    fontSize: '13px',
    marginBottom: '10px',
    gridColumn: '1 / -1',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    backgroundColor: '#8D4F33',
    color: '#FDF5ED',
    padding: '10px',
    textAlign: 'left',
  },
  tdEven: {
    padding: '10px',
    backgroundColor: '#FDF5ED',
    verticalAlign: 'middle',
  },
  tdOdd: {
    padding: '10px',
    backgroundColor: '#ffffff',
    verticalAlign: 'middle',
  },
  thumbnail: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  thumbnailPlaceholder: {
    width: '50px',
    height: '50px',
    background: '#e0cfc0',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#8D4F33',
  },
  editBtn: {
    background: '#8D4F33',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '12px',
    marginRight: '6px',
  },
  deleteBtn: {
    background: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  emptyMsg: {
    color: '#8D4F33',
    fontStyle: 'italic',
    padding: '16px 0',
  },
  photoPreview: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '6px',
    border: '1px solid #c9b49a',
  },
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
  },
}

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
    return `$${Number(price).toFixed(2)}`
  }

  return (
    <div style={styles.page}>
      <div style={styles.main}>
        <h1 style={{ color: '#482E1D', fontFamily: 'monospace', marginBottom: '32px' }}>
          Seller Dashboard
          {user && (
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '12px', color: '#8D4F33' }}>
              Welcome, {user.full_name}
            </span>
          )}
        </h1>

        {/* ── SECTION 1: Create / Edit Listing Form ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>
            {editingId ? 'Edit Listing' : 'Create New Listing'}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            {generalError && (
              <p style={styles.generalError}>{generalError}</p>
            )}

            {/* Pet Name */}
            <label style={styles.label}>
              Pet Name *
              <input
                style={styles.input}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Buddy"
              />
              {fieldErrors.name && (
                <span style={styles.fieldError}>{fieldErrors.name}</span>
              )}
            </label>

            {/* Species */}
            <label style={styles.label}>
              Species *
              <input
                style={styles.input}
                type="text"
                name="species"
                value={form.species}
                onChange={handleChange}
                required
                placeholder="e.g. Dog"
              />
              {fieldErrors.species && (
                <span style={styles.fieldError}>{fieldErrors.species}</span>
              )}
            </label>

            {/* Breed */}
            <label style={styles.label}>
              Breed *
              <input
                style={styles.input}
                type="text"
                name="breed"
                value={form.breed}
                onChange={handleChange}
                required
                placeholder="e.g. Golden Retriever"
              />
              {fieldErrors.breed && (
                <span style={styles.fieldError}>{fieldErrors.breed}</span>
              )}
            </label>

            {/* Age in months */}
            <label style={styles.label}>
              Age (months) *
              <input
                style={styles.input}
                type="number"
                name="age_months"
                value={form.age_months}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 6"
              />
              {fieldErrors.age_months && (
                <span style={styles.fieldError}>{fieldErrors.age_months}</span>
              )}
            </label>

            {/* Price */}
            <label style={styles.label}>
              Price (USD) *
              <input
                style={styles.input}
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
                <span style={styles.fieldError}>{fieldErrors.price_usd}</span>
              )}
            </label>

            {/* Photo upload */}
            <label style={styles.label}>
              Photo (JPEG / PNG / WEBP)
              <input
                style={styles.fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />
              {photoFileError && (
                <span style={styles.fieldError}>{photoFileError}</span>
              )}
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview" style={styles.photoPreview} />
              )}
            </label>

            {/* Description */}
            <label style={{ ...styles.label, ...styles.formFullRow }}>
              Description (max 500 chars)
              <textarea
                style={styles.textarea}
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                placeholder="Tell buyers about this pet…"
              />
              <span style={{ fontSize: '11px', color: '#8D4F33', textAlign: 'right' }}>
                {form.description.length}/500
              </span>
              {fieldErrors.description && (
                <span style={styles.fieldError}>{fieldErrors.description}</span>
              )}
            </label>

            {/* Actions */}
            <div style={styles.formActions}>
              <button style={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : editingId ? 'Update Listing' : 'Create Listing'}
              </button>
              {editingId && (
                <button
                  style={styles.cancelBtn}
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── SECTION 2: My Listings Table ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>My Listings</h2>

          {loadingListings ? (
            <p style={styles.emptyMsg}>Loading listings…</p>
          ) : listings.length === 0 ? (
            <p style={styles.emptyMsg}>No listings yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Photo</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Species</th>
                  <th style={styles.th}>Breed</th>
                  <th style={styles.th}>Age</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, idx) => {
                  const td = idx % 2 === 0 ? styles.tdEven : styles.tdOdd
                  return (
                    <tr key={listing.id}>
                      <td style={td}>
                        {listing.photo_url ? (
                          <img
                            src={listing.photo_url}
                            alt={listing.name}
                            style={styles.thumbnail}
                          />
                        ) : (
                          <div style={styles.thumbnailPlaceholder}>No photo</div>
                        )}
                      </td>
                      <td style={td}>{listing.name}</td>
                      <td style={td}>{listing.species}</td>
                      <td style={td}>{listing.breed}</td>
                      <td style={td}>{listing.age_months} mo</td>
                      <td style={td}>{formatPrice(listing.price_usd)}</td>
                      <td style={td}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            background:
                              listing.status === 'active'
                                ? '#d4edda'
                                : listing.status === 'sold'
                                ? '#fff3cd'
                                : '#f8d7da',
                            color:
                              listing.status === 'active'
                                ? '#155724'
                                : listing.status === 'sold'
                                ? '#856404'
                                : '#721c24',
                          }}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          style={styles.editBtn}
                          onClick={() => populateFormForEdit(listing)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>

        {/* ── SECTION 3: My Orders Table ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>My Orders</h2>

          {loadingOrders ? (
            <p style={styles.emptyMsg}>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p style={styles.emptyMsg}>No orders yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Pet Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Buyer Name</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const td = idx % 2 === 0 ? styles.tdEven : styles.tdOdd
                  return (
                    <tr key={order.id}>
                      <td style={td}>{order.pet_name || '—'}</td>
                      <td style={td}>{formatPrice(order.price_paid ?? order.price)}</td>
                      <td style={td}>{formatDate(order.created_at)}</td>
                      <td style={td}>{order.buyer_name || '—'}</td>
                      <td style={td}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            background:
                              order.status === 'paid'
                                ? '#d4edda'
                                : order.status === 'failed'
                                ? '#f8d7da'
                                : '#e2e3e5',
                            color:
                              order.status === 'paid'
                                ? '#155724'
                                : order.status === 'failed'
                                ? '#721c24'
                                : '#383d41',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}
