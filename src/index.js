import { searchImages } from './api.js';
import notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let currentPage = 1;
let currentQuery = '';
let lightbox;

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchInput = event.target.elements.searchQuery;
  const query = searchInput.value.trim();

  if (query === '') {
    notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  searchImages(query, currentPage)
    .then((data) => {
      if (data.hits.length === 0) {
        showNoResultsMessage();
      } else {
        showImages(data.hits);
        showLoadMoreButton(data.totalHits);
        showTotalHitsMessage(data.totalHits);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

loadMoreButton.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage)
    .then((data) => {
      if (data.hits.length > 0) {
        showImages(data.hits);
        showLoadMoreButton(data.totalHits);
      } else {
        showEndOfResultsMessage();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

function showImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach((image) => {
    const card = createPhotoCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
  refreshLightbox();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function createPhotoCard(image) {
  const cardLink = document.createElement('a');
  cardLink.href = image.largeImageURL;
  cardLink.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.append(likes, views, comments, downloads);
  cardLink.append(img, info);

  return cardLink;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> ${value}`;
  return item;
}

function showNoResultsMessage() {
  clearGallery();
  notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  hideLoadMoreButton();
}

function showEndOfResultsMessage() {
  hideLoadMoreButton();
  notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function showLoadMoreButton(totalHits) {
  if (gallery.childElementCount < totalHits) {
    loadMoreButton.style.display = 'block';
  } else {
    hideLoadMoreButton();
  }
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function showTotalHitsMessage(totalHits) {
  notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function refreshLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }
}
