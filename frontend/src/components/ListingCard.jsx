import { useNavigate } from 'react-router-dom'

const styles = {
  card: {
    borderRadius: '20px',
    backgroundColor: '#fff',
    padding: '20px 30px',
    transition: 'transform 0.5s ease',
    maxHeight: '350px',
    cursor: 'pointer',
  },
  image: {
    borderRadius: '10px',
    width: '100%',
    height: '50%',
    objectFit: 'cover',
  },
  placeholder: {
    borderRadius: '10px',
    width: '100%',
    height: '160px',
    backgroundColor: '#FDF5ED',
  },
  pet: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '20px',
  },
  boxCont: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5px',
  },
  name: {
    fontWeight: 'bold',
    marginTop: '15px',
    fontSize: '20px',
    color: '#482E1D',
    display: 'block',
  },
  description: {
    fontWeight: 500,
    fontSize: '15px',
    color: '#4a4a47',
  },
  both: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  price: {
    fontWeight: 'bold',
    color: '#8D4F33',
    fontSize: '25px',
    display: 'block',
  },
  arrowButton: {
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FDF5ED',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    color: '#482E1D',
    flexShrink: 0,
  },
}

export default function ListingCard({ listing }) {
  const navigate = useNavigate()
  const { id, name, breed, age_months, price_usd, photo_url } = listing

  function handleClick() {
    navigate(`/pet/${id}`)
  }

  function handleButtonClick(e) {
    e.stopPropagation()
    navigate(`/pet/${id}`)
  }

  return (
    <div style={styles.card} onClick={handleClick}>
      {photo_url ? (
        <img src={photo_url} alt={name} style={styles.image} />
      ) : (
        <div style={styles.placeholder} />
      )}

      <div style={styles.pet}>
        <div style={styles.boxCont}>
          <span style={styles.name}>{name}</span>
          <span style={styles.description}>
            {breed} • {age_months} months
          </span>
        </div>

        <div style={styles.both}>
          <span style={styles.price}>${price_usd}</span>
          <button style={styles.arrowButton} onClick={handleButtonClick} aria-label={`View ${name}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
