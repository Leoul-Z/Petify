import { useState, useEffect, useRef, useCallback } from 'react'
import { getListings } from '../api/listings'
import ListingCard from '../components/ListingCard'
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
  },
  content: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
    alignItems: 'center',
  },
  rightContent: {
    width: '100%',
  },
  rightContentP: {
    fontWeight: 400,
    fontSize: '30px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    margin: '0 0 8px 0',
  },
  rightContentSpan: {
    fontWeight: 700,
    fontSize: '50px',
    display: 'block',
  },
  leftContent: {
    width: '100%',
  },
  searchBar: {
    borderRadius: '15px',
    border: '1px solid #e0d5cc',
    padding: '15px 10px',
    width: '90%',
    fontSize: 'large',
    backgroundColor: '#ffffff',
    color: '#482E1D',
    outline: 'none',
    fontFamily: 'inherit',
  },
  filterRow: {
    display: 'flex',
    gap: '15px',
    padding: '0 20px 20px 20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  select: {
    borderRadius: '10px',
    border: '1px solid #e0d5cc',
    padding: '10px 14px',
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#482E1D',
    cursor: 'pointer',
    fontFamily: 'inherit',
    outline: 'none',
  },
  priceInput: {
    borderRadius: '10px',
    border: '1px solid #e0d5cc',
    padding: '10px 14px',
    fontSize: '15px',
    width: '110px',
    backgroundColor: '#ffffff',
    color: '#482E1D',
    fontFamily: 'inherit',
    outline: 'none',
  },
  filterLabel: {
    fontSize: '14px',
    color: '#482E1D',
    fontWeight: 500,
  },
  marketplace: {
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '50px',
  },
  emptyMessage: {
    padding: '60px 20px',
    textAlign: 'center',
    fontSize: '20px',
    color: '#8D4F33',
    gridColumn: '1 / -1',
  },
  loadingMessage: {
    padding: '60px 20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#8D4F33',
    gridColumn: '1 / -1',
  },
}

export default function Shop() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const debounceTimer = useRef(null)

  const fetchListings = useCallback(async (filters) => {
    setLoading(true)
    try {
      const data = await getListings(filters)
      setListings(Array.isArray(data) ? data : [])
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchListings({})
  }, [fetchListings])

  // Re-fetch when species, minPrice, or maxPrice change (immediate)
  useEffect(() => {
    fetchListings({ search, species, minPrice, maxPrice })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [species, minPrice, maxPrice])

  function handleSearchChange(e) {
    const value = e.target.value
    setSearch(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      fetchListings({ search: value, species, minPrice, maxPrice })
    }, 300)
  }

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        {/* Top content section */}
        <section style={styles.content}>
          <div style={styles.rightContent}>
            <p style={styles.rightContentP}>Our Market Place</p>
            <span style={styles.rightContentSpan}>Find Your New Family Member</span>
          </div>
          <div style={styles.leftContent}>
            <input
              style={styles.searchBar}
              type="text"
              placeholder="Search breed or name"
              value={search}
              onChange={handleSearchChange}
              aria-label="Search pets"
            />
          </div>
        </section>

        {/* Filter row */}
        <div style={styles.filterRow}>
          <select
            style={styles.select}
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            aria-label="Filter by species"
          >
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>

          <span style={styles.filterLabel}>Price:</span>
          <input
            style={styles.priceInput}
            type="number"
            placeholder="Min $"
            value={minPrice}
            min="0"
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimum price"
          />
          <input
            style={styles.priceInput}
            type="number"
            placeholder="Max $"
            value={maxPrice}
            min="0"
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price"
          />
        </div>

        {/* Listings grid */}
        <section style={styles.marketplace}>
          {loading ? (
            <p style={styles.loadingMessage}>Loading pets...</p>
          ) : listings.length === 0 ? (
            <p style={styles.emptyMessage}>No pets found.</p>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
