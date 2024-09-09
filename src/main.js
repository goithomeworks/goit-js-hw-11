import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'iziToast/dist/css/iziToast.min.css'; 
import iziToast from 'izitoast';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const gallery = document.getElementById('gallery');
const loadingSpinner = document.getElementById('loading-spinner');

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250
});

searchButton.addEventListener('click', () => {
  const url = `${import.meta.env.VITE_API_URL}/?key=${import.meta.env.VITE_API_KEY}&q=${searchInput.value}&image_type=photo&orientation=horizontal&safesearch=true`;
  loadingSpinner.classList.remove('hidden');

  const fetchData = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Veri alınırken bir hata oluştu');
          }
          return response.json();
        })
        .then((data) => resolve(data))
        .catch((error) => reject('Bir hata oluştu: ' + error.message));
    });
  };

  fetchData(url)
    .then((data) => {
        if (data.hits.length===0){
            iziToast.info({
                title: 'Info',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
                backgroundColor: 'red',
              });
        }
      const galleryItems = data.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
          return `
            <li class="gallery-item">
              <a href="${largeImageURL}" data-lightbox="gallery" data-title="${tags}">
                <img class="gallery-image" src="${webformatURL}" alt="${tags}"/>
              </a>
              <div class="bottom-item">
                <div class="bottom-item-div"><p class="bottom-item-p1">Likes</p><p class="bottom-item-p2">${likes}</p></div>
                <div class="bottom-item-div"><p class="bottom-item-p1">Views</p><p class="bottom-item-p2">${views}</p></div>
                <div class="bottom-item-div"><p class="bottom-item-p1">Comments</p><p class="bottom-item-p2">${comments}</p></div>
                <div class="bottom-item-div"><p class="bottom-item-p1">Downloads</p><p class="bottom-item-p2">${downloads}</p></div>
              </div>
            </li>
          `;
        })
        .join("");
    

      gallery.innerHTML = galleryItems;
      lightbox.refresh();
    })
    .catch((error) => {
      console.log('Hata:', error);
    })
    .finally(() => {
      loadingSpinner.classList.add('hidden');
      
    });
});
