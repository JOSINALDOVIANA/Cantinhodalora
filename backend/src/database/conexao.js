import * as dotenv from 'dotenv';
dotenv.config();

import knex from "knex";
import conect from '../../knexfile.js';
// console.log(conect[process.env.NODE_ENV]);
const conexao = knex(conect[process.env.NODE_ENV]);
export default conexao;