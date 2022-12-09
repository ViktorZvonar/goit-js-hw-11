import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPics } from './js/fetch';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const btnLoadMore = document.querySelector('.load-more');
let lightBox = new SimpleLightbox('.gallery a');
let page;
let demand;

searchFormEl.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(event) {
  page = 1;
  event.preventDefault();
  demand = event.currentTarget.searchQuery.value.trim();
  galleryEl.innerHTML = '';

  if (demand === '') {
    return Notiflix.Notify.info('Please type your search');
  }

  fetchPics(demand)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        render(data.hits);
        lightBox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

        btnLoadMore.classList.remove('hidden');
      }
      if (data.totalHits <= 40) {
        btnLoadMore.classList.add('hidden');
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;

  fetchPics(demand, page)
    .then(({ data }) => {
      render(data.hits);
      lightBox.refresh();

      if (page > Math.round(data.totalHits / 40)) {
        btnLoadMore.classList.add('hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

function render(data) {
  const galleryMarkup = data
    .map(
      ({
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <a class="photo-link" href="${largeImageURL}">
          <div class="photo-card" id="${id}">
            <img class="photo-card__img" src="${webformatURL}" alt="${tags}"/>
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
}
