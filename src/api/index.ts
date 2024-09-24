import axios from 'axios';

const api = axios.create({
    baseURL: 'backend-qa-ckavg5ewbqeubrgb.canadacentral-01.azurewebsites.net/api',
});

export default api;
