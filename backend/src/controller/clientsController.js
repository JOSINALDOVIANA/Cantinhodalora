import db from '../database/conexao.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do cliente
 *         name:
 *           type: string
 *           description: Nome completo do cliente
 *         email:
 *           type: string
 *           description: Endereço de e-mail do cliente
 *         phone:
 *           type: string
 *           description: Número de telefone/celular do cliente
 *         address:
 *           type: string
 *           description: Endereço residencial do cliente
 *       example:
 *         id: "1"
 *         name: "Maria Silva"
 *         email: "maria.silva@example.com"
 *         phone: "11999999999"
 *         address: "Rua das Flores, 123"
 */

/**
 * @openapi
 * tags:
 *   name: Clients
 *   description: Rotas relacionadas a clientes cadastrados
 */

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Retorna a lista de todos os clientes
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erro interno no servidor ao buscar clientes
 */
export const getAllClients = async () => {
  try {
    return await db('clients').select('*');
  } catch (error) {
    throw new Error('Erro ao buscar clients: ' + error.message);
  }
};

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Retorna um cliente específico pelo seu ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente a ser buscado
 *     responses:
 *       200:
 *         description: Dados do cliente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente não encontrado
 */
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

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Cadastra um novo cliente
 *     tags: [Clients]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erro ao cadastrar o cliente
 */
export const createClient = async (clienteData) => {
  try {
    const [id] = await db('clients').insert(clienteData).returning('id');
    return { id, ...clienteData };
  } catch (error) {
    throw new Error('Erro ao criar cliente: ' + error.message);
  }
};

/**
 * @openapi
 * /api/clients/{id}:
 *   put:
 *     summary: Atualiza os dados de um cliente existente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erro ao atualizar o cliente
 */
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

/**
 * @openapi
 * /api/clients/{id}:
 *   delete:
 *     summary: Deleta um cliente do banco de dados
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do cliente a ser excluído
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente deletado com sucesso
 *       500:
 *         description: Erro ao deletar o cliente
 */
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