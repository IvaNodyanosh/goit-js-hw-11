import axios from "axios";


import Notiflix from 'notiflix';

import "notiflix/dist/notiflix-3.2.6.min.css";

const searchForm = document.querySelector('#search-form');

const input = document.querySelector('#searchQuery');

const gallery = document.querySelector('.gallery');

const button = document.querySelector('.load-more');

console.log(button);


console.log(searchForm);

let page = 1;

const serverRequest = async () => {

    page = 1;

    if (!button.classList.contains("phantom")) {
        button.classList.add(phantom);

    }

    try {
        const response = await axios.get(`https://pixabay.com/api/?key=39382301-87481c6222a57772410795ead&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
      console.log(response);
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        if (!response.data.hits.length > 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        }
        button.classList.remove("phantom");
      gallery.innerHTML = listCreate(response.data.hits);

    } catch (error) {
        Notiflix.Notify.failure("ERROR!");
    }
}

const listCreate = function (hits) {
    const addList = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px" height="auto"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`).join('');
    
    return addList;
}

const loadMore = async function () {
    page += 1;
    
    
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=39382301-87481c6222a57772410795ead&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
      gallery.insertAdjacentHTML('beforeend', listCreate(response.data.hits));
        let totalPages = response.data.totalHits / 40;
        console.log(totalPages);
        if (totalPages < page) {
            button.classList.add('phantom');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }

    } catch (error) {
        console.log(error.message)
    }
}

searchForm.addEventListener("submit", (event) => { event.preventDefault(); serverRequest() });
button.addEventListener('click', loadMore);