import axios from 'axios';
export { fetchPics };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const MY_KEY = '31880656-95c2fbbe9581639500b790cae';

async function fetchPics(demand, page) {
  return await axios.get(
    `?key=${MY_KEY}&q=${demand}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
