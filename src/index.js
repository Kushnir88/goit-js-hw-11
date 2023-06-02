const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.remove('show');

  await fetchImages();
});

loadMoreBtn.addEventListener('click', async () => {
  await fetchImages();
});

async function fetchImages() {
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
      showErrorMessage('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    data.hits.forEach((image) => {
      const photoCard = createPhotoCard(image);
      gallery.appendChild(photoCard);
    });

    if (data.totalHits <= currentPage * ITEMS_PER_PAGE) {
      loadMoreBtn.style.display = 'none';
      showInfoMessage("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.classList.add('show');
    }

    currentPage++;
  } catch (error) {
    console.error(error);
    showErrorMessage('An error occurred while fetching images. Please try again later.');
  }
}

function createPhotoCard(image) {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

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

  photoCard.append(img, info);

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
  // Implement your image modal logic here
  console.log('Open image modal:', imageUrl, altText);
}

function showErrorMessage(message) {
  notiflix.Notify.Failure(message);
}

function showInfoMessage(message) {
  notiflix.Notify.Info(message);
}
