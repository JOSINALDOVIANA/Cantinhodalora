import axios from 'axios';
export const url = "https://www.cantinhodalora.info";
export const api = axios.create({
    baseURL: url,
    // http://109.123.243.212:3001/


})