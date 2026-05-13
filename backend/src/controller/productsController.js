import db from '../database/db.js';

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
      }
      produto.url = produto.images.find(img => img.id === produto.image_id)?.url || null;
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
      }
      produtos[key].url = produtos[key].images.find(img => img.id === produtos[key].image_id)?.url || null;
    }
    return res.json({ status: true, produtos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Erro ao buscar products: ' + error.message });
  }
};

// export const getProductById = async (id) => {
//   try {
//     const produto = await db('products').where({ id }).first();
//     if (!produto) {
//       throw new Error('Produto não encontrado');
//     }
//     return produto;
//   } catch (error) {
//     throw new Error('Erro ao buscar produto: ' + error.message);
//   }
// };

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