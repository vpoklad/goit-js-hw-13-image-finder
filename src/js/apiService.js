const KEY = '23050146-8315646a187241c7ace27efa4'
export default function fetchImages(searchQuery, pageNumber) {

   return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${pageNumber}&per_page=12&key=${KEY}
`).then(r => r.json()).catch( error => console.log(error)) 
    
}