import * as dotenv from 'dotenv';
dotenv.config();

import knex from "knex";
import conect from '../../knexfile.js';
const conexao = knex({
  ...conect[process.env.NODE_ENV || 'development'],
  pool: {
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 60000,
    destroyTimeoutMillis: 60000,
    idleTimeoutMillis: 60000,
  }
});
export default conexao;