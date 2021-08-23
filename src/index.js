import './sass/main.scss';
import '../node_modules/@pnotify/core/BrightTheme.css';
import fetchImages from '../src/js/apiService'
import cardTemplate from '../src/templates/cardTemplate';



import {error, notice } from '../node_modules/@pnotify/core/dist/PNotify.js';


// const debounce = require('lodash.debounce');
  

const refs = {
    form: document.querySelector('#search-form'),
    target: document.querySelector('.gallery'),
    buttonMore: document.querySelector('.more_button'),
    intersector: document.querySelector('#intersector')
   
};
let pageNumber = 1;
let markup = '';
let searchQuery = '';

refs.form.addEventListener('submit', onFormSubmit)
refs.buttonMore.addEventListener('click', onMoreButtonclick)

// function OnImgClick(e) {
//     if (e.target.nodeName !== "IMG") return;
// markup = ''
//     searchQuery = e.target.dataset.code;
   
    
// }


function onFormSubmit(e) {
    pageNumber = 1;
    refs.target.innerHTML = '';
    refs.buttonMore.classList.remove('isActive')
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
                    createMarkup(result);
                    pageNumber += 1;
                    form.reset();
                    refs.buttonMore.classList.add('isActive')
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
  
function onMoreButtonclick(e) {
    // e.preventDefault();
    fetchImages(searchQuery.trim(), pageNumber)
            .then((result) => {
                createMarkup(result);
                pageNumber +=1;
                refs.buttonMore.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
});
                
            })
    .catch(error => console.log(error)) 
}


function createMarkup(data) {

    markup = cardTemplate(data);
    refs.target.insertAdjacentHTML('beforeend', markup)
    
}


