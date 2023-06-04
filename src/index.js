// script.js

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './api.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentPage = 1;
  currentQuery = e.target.searchQuery.value.trim();

  if (currentQuery === '') {
    return;
  }

  if (currentQuery.includes(' ')) {
    Notiflix.Notify.failure("Please remove spaces from your search query.");
    return;
  }

  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  const { images, totalHits } = await searchImages(currentQuery, currentPage);

  if (images) {
    renderImages(images);
    if (totalHits > currentPage * 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    initializeLightbox();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  const { images, totalHits } = await searchImages(currentQuery, currentPage);

  if (images) {
    renderImages(images);
    if (totalHits <= currentPage * 40) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    initializeLightbox();
  }
});

function renderImages(images) {
  const cardsHTML = images.map((image) => {
    return `
      <a href="${image.largeImageURL}" class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </a>
    `;
  });

  gallery.insertAdjacentHTML('beforeend', cardsHTML.join(''));
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
