import axios from 'axios';

// API configuration for translation service
const API_URL = 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator';
const API_KEY = '96c686385bmsh55ef47aac625486p110f2ajsnb8dea4c52c35'; // Replace with your actual API key

// Translation function that makes API request
export const translateText = async (from, to, query) => {
  // Configure API request headers and parameters
  const options = {
    method: 'POST',
    url: API_URL,
    params: { from, to, query },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
  };

  // Handle different types of API errors with specific messages
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    // Handle different error scenarios with appropriate messages
    if (error.response) {
      throw new Error(`Translation failed: ${error.response.data.message || error.message}`);
    }
    // ... error handling continues
  }
};