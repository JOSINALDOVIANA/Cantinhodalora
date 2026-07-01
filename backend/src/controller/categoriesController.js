import db from '../database/conexao.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da categoria
 *         name:
 *           type: string
 *           description: Nome da categoria
 *       example:
 *         id: "1"
 *         name: "Bebidas"
 */

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Rotas relacionadas a categorias de produtos
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Retorna todas as categorias cadastradas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro interno no servidor ao buscar categorias
 */
export const getAllCategories = async (req, res) => {
  try {
    return res.json({
      categories: await db('categories').select('*')
    })
  } catch (error) {
    return res.json({
      categories: []
    })
  }
};

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Retorna uma categoria específica pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada
 */
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await db('categories').where({ id }).first();
    if (!categoria) {
      return res.json({ category: {} })
    }
    return res.json({ category: categoria })
  } catch (error) {
    return res.json({ category: {} })
  }
};

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da categoria
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro ao criar categoria
 */
export const createCategory = async (req, res) => {
  const { description } = req.body;
  // console.log("description", description);
  try {
    const [id] = await db('categories').insert({ description }).returning('id');
    return res.json({ status: true, category: { id, description } })
  } catch (error) {
    return res.json({ status: false, error: error.message, category: {} })
  }
};

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Atualiza os dados de uma categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro ao atualizar categoria
 */
export const updateCategory = async (req, res) => {
  const { id, name } = req.body;
  try {
    const updated = await db('categories').where({ id }).update({ name });
    if (!updated) {
      return res.json({ category: {} })
    }
    return await getCategoryById(req, res);
  } catch (error) {
    return res.json({ category: {} })
  }
};

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria a ser deletada
 *     responses:
 *       200:
 *         description: Categoria excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoria deletada com sucesso
 *       500:
 *         description: Erro ao deletar categoria
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db('categories').where({ id }).del();
    return res.json({ status: true, message: 'Categoria deletada com sucesso' })
  } catch (error) {
    return res.json({ status: false, message: 'Erro ao deletar categoria' })
  }
};