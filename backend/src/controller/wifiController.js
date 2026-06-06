import db from '../database/conexao.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     WifiConfig:
 *       type: object
 *       required:
 *         - id
 *         - ssid
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID �nico da configura��o Wi-Fi
 *         ssid:
 *           type: string
 *           description: Nome da rede Wi-Fi
 *         password:
 *           type: string
 *           description: Senha da rede Wi-Fi
 *         encryption:
 *           type: string
 *           description: Tipo de criptografia da rede
 *         criado_em:
 *           type: string
 *           format: date-time
 *           description: Data de cria��o do registro
 *       example:
 *         id: 1
 *         ssid: "CantinhoWiFi"
 *         password: "senha123"
 *         encryption: "WPA2"
 *         criado_em: "2026-06-06T12:00:00Z"
 */

/**
 * @openapi
 * tags:
 *   name: WiFi
 *   description: Rotas para gerenciar configura��es de Wi-Fi
 */

/**
 * @openapi
 * /api/wifi:
 *   get:
 *     summary: Retorna todas as configura��es de Wi-Fi.
 *     tags: [WiFi]
 *     responses:
 *       200:
 *         description: Lista de configura��es de Wi-Fi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wifiConfigs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WifiConfig'
 *       500:
 *         description: Erro interno no servidor
 */
export const getAllWifiConfigs = async (req, res) => {
  // console.log('getAllWifiConfigs called');
  try {
    const wifiConfigs = await db('wifi_configs').select('*');
    return res.json({ wifiConfigs });
  } catch (error) {
    console.error('Erro getAllWifiConfigs:', error);
    return res.status(500).json({ wifiConfigs: [] });
  }
};

/**
 * @openapi
 * /api/wifi/{id}:
 *   get:
 *     summary: Retorna uma configura��o de Wi-Fi pelo ID.
 *     tags: [WiFi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configura��o de Wi-Fi
 *     responses:
 *       200:
 *         description: Configura��o encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wifiConfig:
 *                   $ref: '#/components/schemas/WifiConfig'
 *       404:
 *         description: Configura��o n�o encontrada
 */
export const getWifiConfigById = async (req, res) => {
  const { id } = req.params;
  try {
    const wifiConfig = await db('wifi_configs').where({ id }).first();
    if (!wifiConfig) {
      return res.status(404).json({ wifiConfig: {} });
    }
    return res.json({ wifiConfig });
  } catch (error) {
    console.error('Erro getWifiConfigById:', error);
    return res.status(500).json({ wifiConfig: {} });
  }
};

/**
 * @openapi
 * /api/wifi:
 *   post:
 *     summary: Cria uma nova configura��o de Wi-Fi.
 *     tags: [WiFi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ssid
 *               - password
 *             properties:
 *               ssid:
 *                 type: string
 *               password:
 *                 type: string
 *               encryption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Configura��o criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WifiConfig'
 *       500:
 *         description: Erro ao criar configura��o
 */
export const createWifiConfig = async (req, res) => {
  const { ssid, password, encryption = 'WPA' } = req.body;
  try {
    const [id] = await db('wifi_configs')
      .insert({ ssid, password, encryption })
      .returning('id');
    return res.status(201).json({ wifiConfig: { id, ssid, password, encryption } });
  } catch (error) {
    console.error('Erro createWifiConfig:', error);
    return res.status(500).json({ wifiConfig: {} });
  }
};

/**
 * @openapi
 * /api/wifi/{id}:
 *   put:
 *     summary: Atualiza uma configura��o de Wi-Fi existente.
 *     tags: [WiFi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configura��o de Wi-Fi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ssid:
 *                 type: string
 *               password:
 *                 type: string
 *               encryption:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configura��o atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WifiConfig'
 *       404:
 *         description: Configura��o n�o encontrada
 *       500:
 *         description: Erro ao atualizar configura��o
 */
export const updateWifiConfig = async (req, res) => {
  const { id } = req.params;
  const { ssid, password, encryption } = req.body;
  try {
    const updated = await db('wifi_configs').where({ id }).update({ ssid, password, encryption });
    if (!updated) {
      return res.status(404).json({ wifiConfig: {} });
    }
    return getWifiConfigById(req, res);
  } catch (error) {
    console.error('Erro updateWifiConfig:', error);
    return res.status(500).json({ wifiConfig: {} });
  }
};

/**
 * @openapi
 * /api/wifi/{id}:
 *   delete:
 *     summary: Exclui uma configura��o de Wi-Fi.
 *     tags: [WiFi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da configura��o de Wi-Fi
 *     responses:
 *       200:
 *         description: Configura��o exclu�da com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Configura��o exclu�da com sucesso
 *       404:
 *         description: Configura��o n�o encontrada
 *       500:
 *         description: Erro ao excluir configura��o
 */
export const deleteWifiConfig = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('wifi_configs').where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ message: 'Configura��o n�o encontrada' });
    }
    return res.json({ message: 'Configura��o exclu�da com sucesso' });
  } catch (error) {
    console.error('Erro deleteWifiConfig:', error);
    return res.status(500).json({ message: 'Erro ao excluir configura��o' });
  }
};
