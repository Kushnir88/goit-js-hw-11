import axios from 'axios';

const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

export async function fetchImages(currentQuery, currentPage) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: currentQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: ITEMS_PER_PAGE,
    page: currentPage,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    const data = response.data;

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Сталася помилка під час отримання зображень. Будь ласка, спробуйте ще раз пізніше.');
  }
}
