import axios from 'axios';

const API_URL = 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator';
const API_KEY = '96c686385bmsh55ef47aac625486p110f2ajsnb8dea4c52c35'; // Replace with your actual API key

export const translateText = async (from, to, query) => {
  const options = {
    method: 'POST',
    url: API_URL,
    params: {
      from,
      to,
      query,
    },
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // Assuming the response.data contains the translated text
  } catch (error) {
    // Provide more specific error feedback
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Translation error:', error.response.data);
      throw new Error(`Translation failed: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('Translation failed: No response from server. Please check your network.');
    } else {
      // Something happened in setting up the request
      console.error('Error in request setup:', error.message);
      throw new Error('Translation failed: An error occurred. Please try again.');
    }
  }
};