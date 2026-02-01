import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = form.searchQuery.value.trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({ title: 'No results', message: 'No images found.' });
      hideLoader();
      return;
    }

    createGallery(data.hits);
    hideLoader();

    if (totalHits > currentPage * 15) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    hideLoader();

    const cardHeight = document.querySelector('.gallery a').getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  }
});