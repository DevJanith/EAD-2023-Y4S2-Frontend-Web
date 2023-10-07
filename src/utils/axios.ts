import axios from 'axios';
//Dummy Server
const axiosServices_Mock = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/' });

// Local Server
const axiosServices = axios.create({ baseURL: 'https://localhost:7051/' }); 

// IIS Server
// const axiosServices = axios.create({ baseURL: 'https://192.168.1.3:8082/' }); 

// Azure Server
// const axiosServices = axios.create({ baseURL: 'https://restapi.azurewebsites.net//' }); 


// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices_Mock.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export { axiosServices, axiosServices_Mock };

export default axiosServices_Mock;
