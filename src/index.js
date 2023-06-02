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
      showErrorMessage('На жаль, немає зображень, що відповідають вашому пошуковому запиту. Будь ласка, спробуйте ще раз.');
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
      loadMoreBtn.style.display = 'none';
      showInfoMessage('На жаль, ви досягли кінця результатів пошуку.');
    } else {
      loadMoreBtn.classList.add('show');
    }

    currentPage++;
  } catch (error) {
    console.error(error);
    showErrorMessage('Виникла помилка під час завантаження зображень. Будь ласка, спробуйте ще раз пізніше.');
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

  const likesInfo = createInfoItem('Лайки', likes);
  const viewsInfo = createInfoItem('Перегляди', views);
  const commentsInfo = createInfoItem('Коментарі', comments);
  const downloadsInfo = createInfoItem('Завантаження', downloads);

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
