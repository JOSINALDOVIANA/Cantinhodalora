import db from '../database/conexao.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição detalhada do produto
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *         unit:
 *           type: integer
 *           description: Unidade do produto
 *         size:
 *           type: string
 *           description: Tamanho do produto
 *         url:
 *           type: string
 *           nullable: true
 *           description: URL da imagem principal ativa do produto
 *         image_id:
 *           type: string
 *           nullable: true
 *           description: ID da imagem principal ativa
 *         images:
 *           type: array
 *           description: Lista de imagens associadas ao produto
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               size:
 *                 type: string
 *               key:
 *                 type: string
 *               url:
 *                 type: string
 *               delete:
 *                 type: string
 *         categories:
 *           type: array
 *           description: Lista de categorias associadas ao produto
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *       example:
 *         id: "1"
 *         name: "Coxinha"
 *         description: "Deliciosa coxinha de frango"
 *         price: 5.50
 *         unit: 10
 *         size: "Grande"
 *         url: "http://localhost:3001/api/static/images/coxinha.jpg"
 *         image_id: "123"
 *         images: []
 *         categories: []
 */

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Rotas relacionadas a produtos
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retorna a lista de produtos ou um produto específico
 *     description: Retorna todos os produtos do banco de dados ou filtra por product_id se passado na query.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID de um produto específico para busca
 *     responses:
 *       200:
 *         description: Lista de produtos ou produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 produto:
 *                   $ref: '#/components/schemas/Product'
 *                 produtos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
export const getAllProducts = async (req, res) => {
  const { product_id } = req.query;
  // console.log('product_id:', product_id);

  if (!!product_id) {
    try {
      let produto = await db('products').where({ id: product_id }).first();
      if (!produto) {
        throw new Error('Produto não encontrado');
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      produto.images = await db('product_images').where({ product_id }).join('images', 'product_images.image_id', 'images.id').select('images.*');
      produto.categories = await db('product_categories').where({ product_id }).join('categories', 'product_categories.category_id', 'categories.id').select('categories.*');

      for (let key in produto.images) {
        produto.images[key].delete = `${process.env.SERVER_URL}api/images?id=${produto.images[key].id}&key=${produto.images[key].key}`
        produto.images[key].url = `${process.env.SERVER_URL}api/static/images/${produto.images[key].key}`;
        produto.images[key].urlFull = `${process.env.SERVER_URL}api/images/static/${produto.images[key].key}`;
      }
      produto.url = produto.images.find(img => img.id === produto.image_id)?.url || null;
      produto.urlFull = produto.images.find(img => img.id === produto.image_id)?.urlFull || null;
      return res.json({ status: true, produto });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao buscar produto: ' + error.message });
    }
  };

  try {
    let produtos = await db('products').select('*');
    for (let key in produtos) {
      produtos[key].images = await db('product_images').where({ product_id: produtos[key].id }).join('images', 'product_images.image_id', 'images.id').select('images.*');
      for (let imgKey in produtos[key].images) {
        produtos[key].categories = await db('product_categories').where({ product_id: produtos[key].id }).join('categories', 'product_categories.category_id', 'categories.id').select('categories.*');
        produtos[key].images[imgKey].delete = `${process.env.SERVER_URL}api/images?id=${produtos[key].images[imgKey].id}&key=${produtos[key].images[imgKey].key}`;
        produtos[key].images[imgKey].url = `${process.env.SERVER_URL}api/static/images/${produtos[key].images[imgKey].key}`;
        produtos[key].images[imgKey].urlFull = `${process.env.SERVER_URL}api/images/static/${produtos[key].images[imgKey].key}`;
      }
      produtos[key].url = produtos[key].images.find(img => img.id === produtos[key].image_id)?.url || null;
      produtos[key].urlFull = produtos[key].images.find(img => img.id === produtos[key].image_id)?.urlFull || null;
    }


    return res.json({ status: true, produtos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar products: ' + error.message });
  }
};


/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     description: Registra um novo produto com suas respectivas associações de imagens e categorias.
 *     tags: [Products]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: integer
 *               size:
 *                 type: string
 *               url:
 *                 type: string
 *               image_id:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro ao criar o produto
 */
export const createProduct = async (req, res) => {
  let { description, price, unit, size, url = "", images = [], image_id, name, categories = [] } = req.body;
  console.log("body", req.body);

  // default to 0 to prevent SQL incorrect integer value errors
  price = price ? parseFloat(price) : 0;
  unit = unit ? parseInt(unit) : 0;

  try {
    const [id] = await db('products').insert({ description, price, unit, size, url, image_id, name }).returning('id');

    if (images && images.length > 0) {
      let imgInsert = images.map(img => ({ product_id: id, image_id: img.id }));
      await db('product_images').insert(imgInsert);
    }

    if (categories && categories.length > 0) {
      let catInsert = categories.map(cat => ({ product_id: id, category_id: cat.id }));
      await db('product_categories').insert(catInsert);
    }

    url = images.find(img => img.id === image_id)?.url || null;
    return res.status(201).json({ id, description, price, unit, size, url, images, image_id, name });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar produto: ' + error.message });

  }
};

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza os dados de um produto existente
 *     description: Atualiza os dados principais do produto e renova as associações de categorias e imagens.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: integer
 *               size:
 *                 type: string
 *               url:
 *                 type: string
 *               image_id:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar o produto
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { description, price, unit, size, url = "", images = [], image_id, name, categories = [] } = req.body;
  // console.log("body", req.body);
  try {
    const updated = await db('products').where({ id }).update({ description, price, unit, size, url, image_id, name });
    if (!updated) {
      throw new Error('Produto não encontrado');
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    if (!!images) {
      await db('product_images').where({ product_id: id }).del();
      let imgup = images.map(img => ({ product_id: id, image_id: img.id }));
      await db('product_images').insert(imgup);

    }
    if (!!categories) {
      await db('product_categories').where({ product_id: id }).del();
      let catup = categories.map(cat => ({ product_id: id, category_id: cat.id }));
      await db('product_categories').insert(catup);

    }
    return res.json({ id, description, price, unit, size, url: images.find(img => img.id === image_id)?.url || null, images, image_id, name, categories });
  } catch (error) {
    throw new Error('Erro ao atualizar produto: ' + error.message);
    return res.status(500).json({ error: 'Erro ao atualizar produto: ' + error.message });
  }
};

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Exclui um produto do banco de dados
 *     description: Deleta o registro de um produto pelo seu ID único.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser excluído
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao excluir o produto
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('products').where({ id }).del();
    if (!deleted) {
      throw new Error('Produto não encontrado');
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    throw new Error('Erro ao deletar produto: ' + error.message);
    return res.status(500).json({ error: 'Erro ao deletar produto: ' + error.message });
  }
};