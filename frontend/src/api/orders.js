const BASE = '/api/orders'

export async function createOrder(listingId) {
  const res = await fetch(`${BASE}/index.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ listing_id: listingId }),
  })
  return res.json()
}

export async function getBuyerOrders() {
  const res = await fetch(`${BASE}/index.php`, { credentials: 'include' })
  return res.json()
}

export async function getSellerOrders() {
  const res = await fetch(`${BASE}/seller.php`, { credentials: 'include' })
  return res.json()
}
