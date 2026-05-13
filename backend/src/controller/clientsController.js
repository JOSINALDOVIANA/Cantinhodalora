import db from '../database/db.js';

export const getAllClients = async () => {
  try {
    return await db('clients').select('*');
  } catch (error) {
    throw new Error('Erro ao buscar clients: ' + error.message);
  }
};

export const getClientById = async (id) => {
  try {
    const cliente = await db('clients').where({ id }).first();
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente;
  } catch (error) {
    throw new Error('Erro ao buscar cliente: ' + error.message);
  }
};

export const createClient = async (clienteData) => {
  try {
    const [id] = await db('clients').insert(clienteData).returning('id');
    return { id, ...clienteData };
  } catch (error) {
    throw new Error('Erro ao criar cliente: ' + error.message);
  }
};

export const updateClient = async (id, clienteData) => {
  try {
    const updated = await db('clients').where({ id }).update(clienteData);
    if (!updated) {
      throw new Error('Cliente não encontrado');
    }
    return await getClientById(id);
  } catch (error) {
    throw new Error('Erro ao atualizar cliente: ' + error.message);
  }
};

export const deleteClient = async (id) => {
  try {
    const deleted = await db('clients').where({ id }).del();
    if (!deleted) {
      throw new Error('Cliente não encontrado');
    }
    return { message: 'Cliente deletado com sucesso' };
  } catch (error) {
    throw new Error('Erro ao deletar cliente: ' + error.message);
  }
};