const BASE = '/api/listings'

export async function getListings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.species) params.set('species', filters.species)
  if (filters.minPrice) params.set('min_price', filters.minPrice)
  if (filters.maxPrice) params.set('max_price', filters.maxPrice)
  const res = await fetch(`${BASE}/index.php?${params}`, { credentials: 'include' })
  return res.json()
}

export async function getListing(id) {
  const res = await fetch(`${BASE}/single.php?id=${id}`, { credentials: 'include' })
  return res.json()
}

export async function createListing(data) {
  const res = await fetch(`${BASE}/index.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateListing(id, data) {
  const res = await fetch(`${BASE}/single.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteListing(id) {
  const res = await fetch(`${BASE}/single.php?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return res.json()
}
