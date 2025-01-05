import React from 'react';

const VibeDrop = ({ title, description, image, onFavorite, onViewDetails }) => {
  return (
    <div style={styles.vibeDrop}>
      <img src={image} alt={title} style={styles.image} />
      <div style={styles.content}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>{description}</p>
        <div style={styles.actions}>
          <button onClick={onFavorite} style={styles.button}>
            ❤️ Favorite
          </button>
          <button onClick={onViewDetails} style={styles.button}>
            🔍 View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const VibeTimeline = () => {
  const vibeDrops = [
    {
      title: 'Relaxing Jazz Vibes',
      description: 'Perfect for a cozy evening.',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Workout Beats',
      description: 'Pump up your energy!',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Chill Lo-Fi',
      description: 'Study or unwind with these tunes.',
      image: 'https://via.placeholder.com/400x300',
    },
  ];

  const handleFavorite = (title) => {
    alert(`Favorited: ${title}`);
  };

  const handleViewDetails = (title) => {
    alert(`Viewing details for: ${title}`);
  };

  return (
    <div style={styles.timeline}>
      {vibeDrops.map((vibe, index) => (
        <VibeDrop
          key={index}
          title={vibe.title}
          description={vibe.description}
          image={vibe.image}
          onFavorite={() => handleFavorite(vibe.title)}
          onViewDetails={() => handleViewDetails(vibe.title)}
        />
      ))}
    </div>
  );
};

const styles = {
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  vibeDrop: {
    width: '90%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '8px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default VibeTimeline;
