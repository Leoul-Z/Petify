import { useState, useEffect } from 'react'
import { getBuyerOrders } from '../api/orders'
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
  heading: {
    color: '#482E1D',
    marginBottom: '24px',
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
  emptyMsg: {
    color: '#8D4F33',
    fontStyle: 'italic',
    padding: '16px 0',
  },
  loadingMsg: {
    color: '#8D4F33',
    fontStyle: 'italic',
    padding: '16px 0',
  },
}

function statusBadge(status) {
  const isConfirmed = status === 'confirmed'
  const isCancelled = status === 'cancelled'

  return {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    background: isConfirmed ? '#d4edda' : isCancelled ? '#f8d7da' : '#e2e3e5',
    color: isConfirmed ? '#155724' : isCancelled ? '#721c24' : '#383d41',
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString()
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const data = await getBuyerOrders()
      setOrders(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.main}>
        <h1 style={styles.heading}>My Orders</h1>

        {loading ? (
          <p style={styles.loadingMsg}>Loading orders…</p>
        ) : orders.length === 0 ? (
          <p style={styles.emptyMsg}>No orders yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Pet Photo</th>
                <th style={styles.th}>Pet Name</th>
                <th style={styles.th}>Price Paid</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const td = idx % 2 === 0 ? styles.tdEven : styles.tdOdd
                return (
                  <tr key={order.id}>
                    <td style={td}>
                      {order.photo_url ? (
                        <img
                          src={order.photo_url}
                          alt={order.pet_name}
                          style={styles.thumbnail}
                        />
                      ) : (
                        <div style={styles.thumbnailPlaceholder}>No photo</div>
                      )}
                    </td>
                    <td style={td}>{order.pet_name || '—'}</td>
                    <td style={td}>{formatPrice(order.price_paid ?? order.price)}</td>
                    <td style={td}>{formatDate(order.created_at)}</td>
                    <td style={td}>
                      <span style={statusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>
  )
}
