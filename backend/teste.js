io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);
  // console.log(socket);

  // Registrar usuário
  socket.on('registrarUsuario', (user) => {
    usuariosOnline.push({ ...user, id: socket.id });
    io.emit('usuariosOnline', usuariosOnline);
    socket.join('global');
  });

  // Entrar em sala privativa
  socket.on('joinRoom', (room) => {
    socket.join(room);
    // console.log(`${socket.id} entrou na sala ${room}`);
  });

  // Enviar mensagem para sala + salvar no banco
  socket.on('chatMessage', async (msg) => {
    // console.log('Mensagem recebida:', msg);
    try {
      // salva no banco (sem cor)
      await db('mensagens').insert({
        usuario: msg.usuario,
        conteudo: msg.conteudo,
        sala: msg.sala
      });

      // envia para sala
      io.to(msg.sala).emit('chatMessage', msg);
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }
  });

  // Desconectar
  socket.on('disconnect', () => {
    usuariosOnline = usuariosOnline.filter(u => u.id !== socket.id);
    io.emit('usuariosOnline', usuariosOnline);
    console.log('Usuário desconectado:', socket.id);
  });
});