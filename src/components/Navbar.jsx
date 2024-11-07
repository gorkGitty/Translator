// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Translator</div>
      <div style={styles.navLinks}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/translate">Translate</Link>
        <Link style={styles.link} to="/history">History</Link>
        <Link style={styles.link} to="/voice-translation">Voice Translation</Link>
        <Link style={styles.link} to="/image-translation">Image Translation</Link>
        <Link style={styles.link} to="/sign-language">Sign Language Detection</Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#4A90E2',
    color: '#FFFFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Added shadow for depth
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px', // Slightly increase spacing between letters
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px', // Added padding for a button-like feel
    borderRadius: '5px', // Rounded corners
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover effects
  },
};

export default Navbar;