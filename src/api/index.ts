import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    //baseURL: 'backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api',

});

export default api;
