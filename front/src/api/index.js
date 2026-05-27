import axios from 'axios';
export const url = "https://www.cantinhodalora.info"
// "https://www.cantinhodalora.info";
export const api = axios.create({
    baseURL: url,
    withCredentials: true,

    // http://109.123.243.212:3001/


})