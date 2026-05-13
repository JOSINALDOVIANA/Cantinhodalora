import db from '../database/db.js';

export const getAllCategories = async () => {
  try {
    return await db('categories').select('*');
  } catch (error) {
    throw new Error('Erro ao buscar categories: ' + error.message);
  }
};

export const getCategoryById = async (id) => {
  try {
    const categoria = await db('categories').where({ id }).first();
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    return categoria;
  } catch (error) {
    throw new Error('Erro ao buscar categoria: ' + error.message);
  }
};

export const createCategory = async (categoriaData) => {
  try {
    const [id] = await db('categories').insert(categoriaData).returning('id');
    return { id, ...categoriaData };
  } catch (error) {
    throw new Error('Erro ao criar categoria: ' + error.message);
  }
};

export const updateCategory = async (id, categoriaData) => {
  try {
    const updated = await db('categories').where({ id }).update(categoriaData);
    if (!updated) {
      throw new Error('Categoria não encontrada');
    }
    return await getCategoryById(id);
  } catch (error) {
    throw new Error('Erro ao atualizar categoria: ' + error.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const deleted = await db('categories').where({ id }).del();
    if (!deleted) {
      throw new Error('Categoria não encontrada');
    }
    return { message: 'Categoria deletada com sucesso' };
  } catch (error) {
    throw new Error('Erro ao deletar categoria: ' + error.message);
  }
};