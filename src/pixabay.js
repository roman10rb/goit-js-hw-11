export class PixabayApi {
    #API_KEY = '34959155-6ed4bba7454a69ef49b378772';
    #BASE_URL = 'https://pixabay.com/api/';
    q = null;
    page = 0;
    per_page = 40;
   
    fetchPhotos() {

        return fetch(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${this.q}&image_type=photo&page=${this.page}&per_page=${this.per_page}&orientation=horizontal&safesearch=true`).then(res => {
            if (!res.ok) {
                throw new Error(res.status);
            };
            return res.json()
        });
    }
  
}
