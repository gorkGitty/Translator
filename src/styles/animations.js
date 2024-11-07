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
  scaleIn: {
    transform: 'scale(0.95)',
    opacity: 0,
    animation: 'scaleIn 0.3s ease forwards',
  },
  keyframes: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `
};

export default animations; 