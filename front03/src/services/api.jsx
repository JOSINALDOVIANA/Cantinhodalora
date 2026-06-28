import axios from 'axios';
export const url = window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin;
// window.location.origin;
// "https://www.cantinhodalora.info";
console.log('url', url);
export const api = axios.create({
    baseURL: url,
    withCredentials: true,

    // http://109.123.243.212:3001/


})