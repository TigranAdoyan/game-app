import axios from 'axios';

export default axios.create({
   baseURL: process.env.REACT_APP_REST_URL,
   headers: {
      'x-auth-token': localStorage.getItem('token'),
   }
});