import conexao from '../database/conexao.js';

export const getAllUsers = async (req, res) => {
  // console.log('Fetching all users from the database...', req.method, req.url,`variable: ${process.env.NODE_ENV}`);
  const { user_id } = req.query;
  if (!!user_id) {
    try {
      let user = await conexao('users').where({ id: user_id }).first();
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      if (!!user) {
        user.images = await conexao('user_images').where({ user_id: user.id }).join('images', 'user_images.image_id', 'images.id').select('images.*');
        if (user.images.length > 0) {

          for (const key in user.images) {
            user.images[key].delete = `${process.env.SERVER_URL}api/images?id=${user.images[key].id}&key=${user.images[key].key}`
            user.images[key].url = `${process.env.SERVER_URL}api/static/images/${user.images[key].key}`;
          }
        }
      }

      return res.json({ ...user });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

  }
  try {
    let users = await conexao('users').select('*');
    if (users.length > 0) {
      for (const key in users) {
        users[key].images = await conexao('user_images').where({ user_id: users[key].id }).join('images', 'user_images.image_id', 'images.id').select('images.*');
        if (users[key].images.length > 0) {
          for (const key2 in users[key].images) {
            users[key].images[key2].delete = `${process.env.SERVER_URL}api/images?id=${users[key].images[key2].id}&key=${users[key].images[key2].key}`
            users[key].images[key2].url = `${process.env.SERVER_URL}api/static/images/${users[key].images[key2].key}`;
            if (users[key].images[key2].id == users[key].image_id) {
              users[key].url = users[key].images[key2].url;
            }
          }
        }
      }
    }
    return res.json(users);
  } catch (error) {
    throw new Error('Erro ao buscar usuários: ' + error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await conexao('users').where({ id }).first();
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  } catch (error) {
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
};

export const createUser = async (req, res) => {
  let { name, email, password, image_id, adm = false, images = [], others_info = {} } = req.body;
  try {
    const [id] = await conexao('users').insert({ name, email, password, image_id, adm, others_info }).returning('id');
    if (!!images && images.length > 0) {
      let imagesInsert = images.map((image) => {
        return { user_id: id, image_id: image.id }
      });
      await conexao('user_images').insert(imagesInsert);
    }
    return res.json({ id, name, email, password, image_id, adm, images });
  } catch (error) {
    throw new Error('Erro ao criar usuário: ' + error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, email, password, image_id = null, adm = false, images = [], others_info = {} } = req.body;
  // console.log('Updating user with ID:', id, 'Data:', userData);
  others_info = JSON.stringify(others_info);
  try {
    const updated = await conexao('users').where({ id }).update({ name, email, password, image_id, adm, others_info });
    const imagesDelete = await conexao('user_images').where({ user_id: id }).delete();

    if (!updated) {
      throw new Error('Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });

    }
    if (!!images && images.length > 0) {
      for (const key in images) {
        await conexao('user_images').insert({ user_id: id, image_id: images[key].id });
      }
    }
    return res.json({ id, name, email, password, image_id, adm, others_info, images });
  } catch (error) {

    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await conexao('users').where({ id }).del();
    if (!deleted) {
      throw new Error('Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    throw new Error('Erro ao deletar usuário: ' + error.message);
    return res.status(500).json({ error: error.message });
  }
};
// Função de login do usuário
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await conexao('users').where({ email, password }).first();
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    if (!!user) {
      user.images = await conexao('user_images').where({ user_id: user.id }).join('images', 'user_images.image_id', 'images.id').select('images.*');
      if (user.images.length > 0) {
        for (const key in user.images) {
          user.images[key].delete = `${process.env.SERVER_URL}api/images?id=${user.images[key].id}&key=${user.images[key].key}`
          user.images[key].url = `${process.env.SERVER_URL}api/static/images/${user.images[key].key}`;
          if (user.images[key].id == user.image_id) {
            user.url = user.images[key].url;
          }
        }
      }
    }




    return res.json(user);
  } catch (error) {
    throw new Error('Erro ao realizar login: ' + error.message);
    return res.status(500).json({ error: error.message });
  }
};