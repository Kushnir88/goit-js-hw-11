
import axios from "axios";
const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

async function fetchImages() {
  isLoading = true;

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

    if (data.hits.length === 0) {
      showErrorMessage('На жаль, немає зображень, що відповідають вашому пошуковому запиту. Будь ласка, спробуйте ще раз.');
      isEndOfResults = true;
      gallery.classList.remove('empty');
      return;
    }

    if (currentPage === 1) {
      const totalHits = data.totalHits;
      showInfoMessage(`Hooray! We found ${totalHits} images.`);
    }

    data.hits.forEach((image) => {
      const photoCard = createPhotoCard(image);
      gallery.appendChild(photoCard);
    });

    if (data.totalHits <= currentPage * ITEMS_PER_PAGE) {
      isEndOfResults = true;
      showInfoMessage('На жаль, ви досягли кінця результатів пошуку.');
    } else {
      currentPage++;
     
      observer.observe(gallery.lastElementChild);
    }
  } catch (error) {
    console.error(error);
    showErrorMessage('Сталася помилка під час отримання зображень. Будь ласка, спробуйте ще раз пізніше.');
  }

  isLoading = false;
}

export {api, ITEMS_PER_PAGE}