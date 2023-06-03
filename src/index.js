import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import Notiflix from "notiflix";

const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const searchInput = document.getElementById('search-input');

let currentPage = 1;
let currentQuery = '';

let isLoading = false;
let isEndOfResults = false;

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    showErrorMessage('Будь ласка, введіть пошуковий запит.');
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  gallery.innerHTML = '';
  gallery.classList.add('empty');

  await fetchImages();
});

searchInput.addEventListener('input', () => {
  searchInput.classList.remove('empty');
});

const observer = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting && !isLoading && !isEndOfResults) {
    await fetchImages();
  }
});

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
      showInfoMessage("We're sorry, but you've reached the end of search results.");
    } else {
      currentPage++;
      observer.observe(gallery.lastElementChild);
    }

    const lightbox = new SimpleLightbox('.gallery a', {
      disableScroll: false,
      captionSelector: 'self',
      captionsData: 'alt',
    });
    lightbox.refresh();
  } catch (error) {
    console.error(error);
    showErrorMessage('Сталася помилка під час отримання зображень. Будь ласка, спробуйте ще раз пізніше.');
  }

  isLoading = false;
}

function createPhotoCard(image) {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const link = document.createElement('a');
  link.href = largeImageURL;

  const img = document.createElement('img');
  img.src = webformatURL;
  img.alt = tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likesInfo = createInfoItem('Likes', likes);
  const viewsInfo = createInfoItem('Views', views);
  const commentsInfo = createInfoItem('Comments', comments);
  const downloadsInfo = createInfoItem('Downloads', downloads);

  info.append(likesInfo, viewsInfo, commentsInfo, downloadsInfo);

  link.append(img, info);
  photoCard.appendChild(link);

  img.addEventListener('click', () => {
    openImageModal(largeImageURL, tags);
  });

  return photoCard;
}

function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}: </b>${value}`;

  return infoItem;
}

function openImageModal(imageUrl, altText) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = altText;

  modalContent.appendChild(img);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  modal.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

function showErrorMessage(message) {
  Notiflix.Notify.Failure(message);
}

function showInfoMessage(message) {
  Notiflix.Notify.Info(message);
}
