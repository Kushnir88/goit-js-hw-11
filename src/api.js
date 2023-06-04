
import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '36866998-5308da28c55e509481910204f'; 
export async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      return { images, totalHits };
    }
  } catch (error) {
    Notiflix.Notify.failure('An error occurred. Please try again later.');
  }
}
