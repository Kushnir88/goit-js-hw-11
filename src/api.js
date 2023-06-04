import axios from 'axios';

const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

export async function searchImages(query, page) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${ITEMS_PER_PAGE}`);
    const data = response.data;

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
