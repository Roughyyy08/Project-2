import axios from 'axios';

const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export async function fetchExchangeRates(base = 'INR') {
  const response = await axios.get(`${BASE_URL}/${base}`);
  return response.data;
}
