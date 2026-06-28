import { gerarTokens } from '../functions/TokenJWT.js';
import conexao from '../database/conexao.js';
import jwt from 'jsonwebtoken';
import { gerarHash, verificarSenha } from '../functions/argon2.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: E-mail do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário (hash)
 *         image_id:
 *           type: string
 *           nullable: true
 *           description: ID da imagem ativa de perfil do usuário
 *         adm:
 *           type: boolean
 *           default: false
 *           description: Indica se o usuário é administrador
 *         others_info:
 *           type: object
 *           description: Informações adicionais do usuário
 *         url:
 *           type: string
 *           nullable: true
 *           description: URL completa da imagem ativa de perfil
 *         images:
 *           type: array
 *           description: Lista de imagens associadas ao usuário
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID único da imagem
 *               name:
 *                 type: string
 *                 description: Nome original do arquivo da imagem
 *               size:
 *                 type: string
 *                 description: Tamanho do arquivo em bytes
 *               key:
 *                 type: string
 *                 description: Chave única do arquivo (gerada no upload)
 *               url:
 *                 type: string
 *                 description: URL de acesso público à imagem
 *               delete:
 *                 type: string
 *                 description: Rota e query params para deletar a imagem
 *       example:
 *         id: "1"
 *         name: "Enoane"
 *         email: "user@example.com"
 *         password: "$2b$10$hashedpassword..."
 *         image_id: "1"
 *         adm: false
 *         others_info: {}
 *         url: "http://localhost:3001/api/static/images/perfil.jpg"
 *         images:
 *           - id: "1"
 *             name: "perfil.jpg"
 *             size: "2048"
 *             key: "perfil.jpg"
 *             url: "http://localhost:3001/api/static/images/perfil.jpg"
 *             delete: "http://localhost:3001/api/images?id=1&key=perfil.jpg"
 */

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Rotas relacionadas a usuários
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retorna a lista de usuários ou um usuário específico
 *     description: 
 *       Esta rota exige autenticação via JWT (passado via cookie `accessToken`). 
 *       Se o parâmetro `user_id` não for informado na query, retorna todos os usuários cadastrados.
 *       Caso contrário, retorna apenas as informações do usuário correspondente.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do usuário para busca específica
 *     responses:
 *       200:
 *         description: Retorna a lista de usuários ou as informações do usuário solicitado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 - $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de acesso ausente ou expirado
 *       403:
 *         description: Token de acesso inválido
 *       404:
 *         description: Usuário não encontrado (quando user_id é informado)
 *       500:
 *         description: Erro interno no servidor ao buscar usuários
 */
export const getAllUsers = async (req, res) => {
  // console.log('Conexão:', conexao)
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
      // console.log(error)
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
    // console.log(error)
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

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Registra um novo usuário no banco de dados. Não requer autenticação.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: Endereço de e-mail único do usuário
 *               password:
 *                 type: string
 *                 description: Senha para login
 *               image_id:
 *                 type: string
 *                 nullable: true
 *                 description: ID da imagem do usuário (opcional)
 *               adm:
 *                 type: boolean
 *                 default: false
 *                 description: Define se o usuário possui privilégios de administrador
 *               images:
 *                 type: array
 *                 description: Lista de imagens a serem associadas ao usuário
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID da imagem salva previamente
 *               others_info:
 *                 type: object
 *                 description: Informações adicionais customizadas do usuário
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 image_id:
 *                   type: string
 *                   nullable: true
 *                 adm:
 *                   type: boolean
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Erro interno ao criar o usuário
 */
export const createUser = async (req, res) => {
  let { name, email, password, image_id, adm = false, images = [], others_info = {} } = req.body;
  let { hash } = await gerarHash(password);
  try {
    const [id] = await conexao('users').insert({ name, email, password: hash, image_id, adm, others_info }).returning('id');
    if (!!images && images.length > 0) {
      let imagesInsert = images.map((image) => {
        return { user_id: id, image_id: image.id }
      });
      await conexao('user_images').insert(imagesInsert);
    }
    return res.json({ id, name, email, password: hash, image_id, adm, images });
  } catch (error) {

    return res.status(500).json({ error: error.message });
  }
};

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     description: Atualiza os dados cadastrais e as associações de imagem de um usuário existente pelo seu ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
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
 *               password:
 *                 type: string
 *               image_id:
 *                 type: string
 *                 nullable: true
 *               adm:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *               others_info:
 *                 type: object
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  let { name, email, password, image_id = null, adm = false, images = [], others_info = {} } = req.body;
  // console.log('Updating user with ID:', id, 'Data:', userData);
  others_info = JSON.stringify(others_info);
  try {
    const updated = await conexao('users').where({ id }).update({ name, email, password, image_id, adm, others_info });
    const imagesDelete = await conexao('user_images').where({ user_id: id }).delete();

    if (!updated) {
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

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário do sistema
 *     description: Deleta o registro de um usuário com base no ID fornecido nos parâmetros da rota.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
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
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Verifica as credenciais do usuário e retorna seus dados, definindo os tokens JWT (`accessToken` e `refreshToken`) nos cookies do cliente.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Os cookies `accessToken` e `refreshToken` são definidos na resposta.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas (e-mail ou senha incorretos)
 *       500:
 *         description: Erro interno no servidor
 */
export const userLogin = async (req, res) => {
  let { email, password } = req.body;



  try {
    if (!!email) {
      let user = await conexao('users').where({ email }).first();

      if (!!user && (await verificarSenha(password, user.password)).status) {
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

        // Gera os tokens e configura os cookies para qualquer login bem-sucedido, com ou sem imagens
        const { accessToken, refreshToken } = gerarTokens({ id: user.id, name: user.name, email: user.email, password: user.password });

        // Cookies HTTPOnly
        res.cookie("accessToken", accessToken, {
          httpOnly: true,   // impede acesso via document.cookie
          secure: true,     // só envia em conexões HTTPS
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ status: true, message: 'Login realizado com sucesso', user });
      }
      return res.status(401).json({ status: false, message: 'Credenciais inválidas(email ou senha)' });
    }
    return res.status(401).json({ status: false, message: 'Credenciais inválidas(email)' });


  } catch (error) {
    // throw new Error('Erro ao realizar login: ' + error.message);
    return res.status(500).json({ status: false, message: 'Erro ao realizar login DB', error: error.message });
  }
};

//refresh token
/**
 * @openapi
 * /api/users/refresh:
 *   post:
 *     summary: Renova o token de acesso (accessToken)
 *     description: 
 *       Recebe o `refreshToken` através dos cookies do cliente, valida-o e gera um novo `accessToken` retornado nos cookies.
 *       Retorna também os dados atualizados do usuário.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token renovado com sucesso. O novo `accessToken` é definido no cookie da resposta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token renovado
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Refresh token ausente nos cookies
 *       403:
 *         description: Refresh token inválido ou expirado
 */
export const userRefresh = async (req, res) => {
  // console.log('cookie')
  const { refreshToken } = req.cookies;
  // console.log("refreshToken", refreshToken);

  if (!refreshToken) return res.status(401).send("Refresh token ausente");

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ status: false, message: 'Refresh token inválido', error: err.message });
    const { accessToken } = gerarTokens({ id: user.id, name: user.name, email: user.email, password: user.password });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,   // impede acesso via document.cookie
      secure: true,     // só envia em conexões HTTPS
      sameSite: "strict", // evita envio em requisições cross-site

      maxAge: 15 * 60 * 1000,
    });

    // console.log("user", user);
    let userSerializer = await conexao('users').where({ id: user.id, email: user.email, password: user.password }).first();
    if (!!userSerializer) {
      userSerializer.images = await conexao('user_images').where({ user_id: user.id }).join('images', 'user_images.image_id', 'images.id').select('images.*');
      if (userSerializer.images.length > 0) {
        for (const key in userSerializer.images) {
          userSerializer.images[key].delete = `${process.env.SERVER_URL}api/images?id=${userSerializer.images[key].id}&key=${userSerializer.images[key].key}`
          userSerializer.images[key].url = `${process.env.SERVER_URL}api/static/images/${userSerializer.images[key].key}`;
          if (userSerializer.images[key].id == userSerializer.image_id) {
            userSerializer.url = userSerializer.images[key].url;
          }
        }
      }
    }


    return res.json({ status: true, message: "Token renovado", user: userSerializer });
  });

}

//logout
/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     description: Limpa os cookies `accessToken` e `refreshToken` no navegador do cliente.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso. Os cookies de tokens são removidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout realizado
 */
export const userLogout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout realizado" });
}