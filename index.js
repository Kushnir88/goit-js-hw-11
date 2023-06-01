
const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 20;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  currentQuery = e.target.searchQuery.value.trim();
  await searchImages(currentQuery, currentPage);
});

loadMoreBtn.addEventListener('click', async () => {
  await searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: ITEMS_PER_PAGE,
        page: page,
      },
    });

    const { data } = response;
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      showErrorMessage('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    displayImages(hits);

    if (hits.length < totalHits) {
      showLoadMoreButton();
      currentPage++;
    } else {
      hideLoadMoreButton();
      showInfoMessage("We're sorry, but you've reached the end of search results.");
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
