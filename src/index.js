import { PixabayApi } from './pixabay';
import { Notify } from 'notiflix';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";




const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');


const pixabayApi = new PixabayApi();

const reset = () => {
    galleryEl.innerHTML = '';
    pixabayApi.page = 0;
}

const searchPhotos = async (event) => {
    try {

event.preventDefault();
    reset();
    const searchQuery = event.target.elements['searchQuery'].value.trim();
    pixabayApi.q = searchQuery;
    pixabayApi.page += 1;


        const data = await pixabayApi.fetchPhotos();
        
        
        if (pixabayApi.q === '' || data.totalHits === 0 ) {
             Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            loadMoreBtnEl.classList.add('is-hidden');
            return;
        }; 

        
         createCard(data);
         showBigPicture();
         
        loadMoreBtnEl.classList.remove('is-hidden');
        if (data.hits.length < pixabayApi.per_page) {
        Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtnEl.classList.add('is-hidden');
        }
       
    

    } catch (error)  {
        console.log(error.message);
        Notify.info('Images not found');
        loadMoreBtnEl.classList.add('is-hidden');
    }
}

const loadMoreBtnClick = async () => {
    try {
        pixabayApi.page += 1;
        const data = await pixabayApi.fetchPhotos();

        createCard(data);
        showBigPicture();
        
        if (data.hits.length < pixabayApi.per_page) {
        Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtnEl.classList.add('is-hidden');
        }   
    } catch (e) {
        console.log(e.status);
    }
    
    
}

loadMoreBtnEl.addEventListener('click', loadMoreBtnClick);
searchFormEl.addEventListener('submit', searchPhotos);


 function showBigPicture () {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.captionDelay = 250;
};

function createCard(data) {
    for (let i = 0; i < data.hits.length; i += 1){

            galleryEl.insertAdjacentHTML('beforeend',
                `<div class="photo-card">
                <div class="container"><a class="gallery__item" href=${data.hits[i].largeImageURL}>
         <img src="${data.hits[i].webformatURL}" alt="" loading="lazy" />
      </a></div>
  <div class="info">
    <p class="info-item">
      <b>Likes <span class="info-value">${data.hits[i].likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <span class="info-value">${data.hits[i].views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class="info-value">${data.hits[i].comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class="info-value">${data.hits[i].downloads}</span></b>
    </p>
  </div>
</div>`);
                    
}
}





