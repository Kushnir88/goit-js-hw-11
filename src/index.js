import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import Notiflix from "notiflix";

import { fetchImages, createPhotoCard, createInfoItem, openImageModal, showErrorMessage, showInfoMessage } from "./fetchImages";

const API_KEY = '36866998-5308da28c55e509481910204f';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

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

  await fetchImages(API_KEY, BASE_URL, ITEMS_PER_PAGE, currentQuery, currentPage, gallery, observer, showErrorMessage, showInfoMessage);
});

const observer = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting && !isLoading && !isEndOfResults) {
    await fetchImages(API_KEY, BASE_URL, ITEMS_PER_PAGE, currentQuery, currentPage, gallery, observer, showErrorMessage, showInfoMessage);
  }
});

const lightbox = new SimpleLightbox('.gallery a');
lightbox.refresh();
