const API_KEY = '36866998-5308da28c55e509481910204f';
import { fetchImages } from './api.js';


const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', fetchImages);

async function handleFormSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  currentQuery = form.elements.searchQuery.value.trim();

  if (currentQuery === '') {
    return;
  }

  clearGallery();
  await fetchImages();
  showLoadMoreButton();
}

async function fetchImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: currentQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    const data = response.data;

    if (data.hits.length > 0) {
      displayImages(data.hits);
      currentPage++;
    } else {
      hideLoadMoreButton();
      showInfoMessage("Sorry, there are no images matching your search query. Please try again.");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage('An error occurred while fetching images. Please try again later.');
  }
}

function displayImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach((image) => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imageElement = document.createElement('img');
  imageElement.src = image.webformatURL;
  imageElement.alt = image.tags;
  imageElement.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.append(likes, views, comments, downloads);
  card.append(imageElement, info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> ${value}`;
  return item;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function showErrorMessage(message) {
  notiflix.Notify.failure(message);
}

function showInfoMessage(message) {
  notiflix.Notify.info(message);
}
