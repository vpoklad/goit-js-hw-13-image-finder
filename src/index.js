import './sass/main.scss';
import '../node_modules/@pnotify/core/BrightTheme.css';
import fetchImages from '../src/js/apiService'
import cardTemplate from '../src/templates/cardTemplate';
import * as basicLightbox from 'basiclightbox';
import {error, notice } from '../node_modules/@pnotify/core/dist/PNotify.js';


import throttle from 'lodash.throttle';
  

const refs = {
    form: document.querySelector('#search-form'),
    target: document.querySelector('.gallery'),
    buttonMore: document.querySelector('.more_button'),
    upButton: document.querySelector('.up_button'),
    intersector: document.querySelector('#intersector')
   
};

let pageNumber = null;
let markup = '';
let searchQuery = '';

refs.form.addEventListener('submit', onFormSubmit)
// refs.buttonMore.addEventListener('click', debounce(onMoreButtonclick, 300))
refs.target.addEventListener('click',OnImgClick)
refs.upButton.addEventListener('click', scrollToTop)
window.addEventListener('scroll', throttle(trackScroll), 100);


function trackScroll() {
          let scrolled = window.pageYOffset;
          let coords = document.documentElement.clientHeight;
      
          if (scrolled > coords) {
            refs.upButton.classList.add('isActive');
          }
          if (scrolled < coords) {
            refs.upButton.classList.remove('isActive');
          }
        }

function scrollToTop() {
refs.upButton.classList.remove('isActive');
  refs.form.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
})
}


function OnImgClick(e) {
    if (e.target.nodeName !== "IMG") return;

    const imgURL = e.target.dataset.largeimg;
    basicLightbox.create(`<div class="modal">
		<img width="1200" src="${imgURL}">
        </div>
	`).show()
   
    
}


function onFormSubmit(e) {
    
    pageNumber = 1;
    refs.target.innerHTML = '';
    // refs.buttonMore.classList.remove('isActive')
    e.preventDefault();
    const form = e.currentTarget;
    searchQuery = form.elements.query.value;   
   

    if (!searchQuery.trim()) {
        error({
        title: 'Enter valid query.',
            text: 'Please check you spelling',
    delay: 3000
  });
       return; 
    }
    else {
        fetchImages(searchQuery.trim(), pageNumber)
            .then((result) => {
                if (result.hits.length > 0) {

notice({
        title: 'Success!',
            text: `Found more than ${result.total} results`,
    delay: 3000
  });

                    createMarkup(result);
                    pageNumber += 1;
                    form.reset();
                    // refs.buttonMore.classList.add('isActive')
                } else {
                         error({
        title: 'Nothing is found.',
            text: 'Please check you spelling',
    delay: 3000
  });
                }
            })
    .catch(error => console.log(error)) 
    }   
    
}
  
// function onMoreButtonclick(e) {
//     // e.preventDefault();
//     fetchImages(searchQuery.trim(), pageNumber)
//             .then((result) => {
//                 createMarkup(result);
//                 pageNumber +=1;
// refs.buttonMore.scrollIntoView({
//   behavior: 'smooth',
//   block: 'end',
// });
                
//             })
//     .catch(error => console.log(error)) 
// }


function createMarkup(data) {

    markup = cardTemplate(data);
    refs.target.insertAdjacentHTML('beforeend', markup)
    
}

const onEntry = entries => {
    entries.forEach(entry => {

        if (entry.isIntersecting && searchQuery !== '') {
            // refs.upButton.classList.add('isActive')
            if (pageNumber === 1) {
                pageNumber = 2; //Это костыль чтоб обсервер не выводил дважды страницу 1 при смене запроса
            }
            
            fetchImages(searchQuery.trim(), pageNumber)
            .then((result) => {
                createMarkup(result);
                pageNumber +=1;                
            })
    .catch(error => console.log(error))
        } else {
            
        }
    });
};
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '180px',
});
observer.observe(refs.intersector);


