import axios from 'axios';
export const url = "http://127.0.0.1:3001/";
export const api = axios.create({
    baseURL: url,
    // http://109.123.243.212:3001/


})