// import axios from 'axios';

// const API_KEY = '36866998-5308da28c55e509481910204f';

// export async function fetchImages(query, page, perPage) {
//   try {
//     const response = await axios.get('https://pixabay.com/api/', {
//       params: {
//         key: API_KEY,
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page,
//         per_page: perPage,
//       },
//     });

//     return response.data.hits;
//   } catch (error) {
//     throw new Error('An error occurred while fetching images. Please try again later.');
//   }
// }
