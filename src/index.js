import './sass/main.scss';
// import '../node_modules/@pnotify/core/BrightTheme.css';
import fetchImages from '../src/js/apiService'
import cardTemplate from '../src/templates/cardTemplate';



// import {error, notice } from '../node_modules/@pnotify/core/dist/PNotify.js';


// const debounce = require('lodash.debounce');
  

const refs = {
    form: document.querySelector('#search-form'),
    target: document.querySelector('.gallery')
   
};
let pageNumber = 1;
let markup = '';

refs.form.addEventListener('submit', onFormSubmit)

function OnImgClick(e) {
    if (e.target.nodeName !== "IMG") return;
markup = ''
    searchQuery = e.target.dataset.code;
   
    
}


function onFormSubmit(e) {
    pageNumber = 1;
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.query.value;   
   

    if (!searchQuery.trim()) {
       return; 
    }
    else {
        fetchImages(searchQuery.trim(), pageNumber)
    .then(console.log)
    .catch(error => console.log(error)) 
    }
     

   
   
    
}
    


function createMarkup(data) {
    markup = cardTemplate(data);
    refs.target.insertAdjacentHTML('beforeend', markup)
    
}



    


