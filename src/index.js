import axios from "axios";
import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.6.min.css";
import { listCreate } from "./cards-template";
import { refs } from "./refs";


let page = 0;
const { searchForm, input, gallery, button } = refs;
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "39382301-87481c6222a57772410795ead";




const serverRequest = async () => {

  page = 1;

  if (!button.classList.contains("phantom")) {
    button.classList.add("phantom");
  }

  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        q: input.value,
        page: page,
        per_page: 40,
      }
    });

    gallery.innerHTML = listCreate(response.data.hits);

      
    if (!response.data.hits.length > 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");


      return
    } else {
        
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }


    button.classList.remove("phantom");
    



  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}



const loadMore = async function () {
    
  try {
    
    
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        q: input.value,
        page: page += 1,
        per_page: 40,
      }
    });
    
    
    gallery.insertAdjacentHTML('beforeend', listCreate(response.data.hits));


    let totalPages = response.data.totalHits / 40;


    if (totalPages < page) {

      button.classList.add('phantom');
      

      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}


searchForm.addEventListener("submit", (event) => { event.preventDefault(); serverRequest() });
button.addEventListener('click', loadMore);