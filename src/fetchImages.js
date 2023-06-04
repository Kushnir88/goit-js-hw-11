import axios from "axios";
import SimpleLightbox from "simplelightbox";
import Notiflix from "notiflix";

export async function fetchImages(apiKey, baseUrl, itemsPerPage, currentQuery, currentPage, gallery, observer, showErrorMessage, showInfoMessage) {
  isLoading = true;

  const params = new URLSearchParams({
    key: apiKey,
    q: currentQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: itemsPerPage,
    page: currentPage,
  });

  try {
    const response = await axios.get(`${baseUrl}?${params}`);
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

    if (data.totalHits <= currentPage * itemsPerPage) {
      isEndOfResults = true;
      showInfoMessage("We're sorry, but you've reached the end of search results.");
    } else {
      currentPage++;
      observer.observe(gallery.lastElementChild);
    }

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    console.error(error);
    showErrorMessage('Сталася помилка під час отримання зображень. Будь ласка, спробуйте ще раз пізніше.');
  }

  isLoading = false;
}

export function createPhotoCard(image) {
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

export function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}: </b>${value}`;

  return infoItem;
}

export function openImageModal(imageUrl, altText) {
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

export function showErrorMessage(message) {
  Notiflix.Notify.Failure(message);
}

export function showInfoMessage(message) {
  Notiflix.Notify.Info(message);
}