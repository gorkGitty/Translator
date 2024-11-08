const animations = {
  fadeIn: {
    opacity: 0,
    animation: 'fadeIn 0.3s ease forwards',
  },
  slideUp: {
    transform: 'translateY(20px)',
    opacity: 0,
    animation: 'slideUp 0.4s ease forwards',
  },
  slideRight: {
    transform: 'translateX(-20px)',
    opacity: 0,
    animation: 'slideRight 0.4s ease forwards',
  },
  scaleIn: {
    transform: 'scale(0.95)',
    opacity: 0,
    animation: 'scaleIn 0.3s ease forwards',
  },
  buttonHover: {
    transform: 'translateY(-1px)',
    transition: 'all 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export default animations; 