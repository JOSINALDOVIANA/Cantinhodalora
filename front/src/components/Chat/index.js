import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { url } from '../../api/index.js'; // certifique-se de que a URL do backend está correta
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Slide,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Funções auxiliares
function gerarNomeAleatorio() {
  const nomes = ['Orion', 'Luna', 'Pixel', 'Echo', 'Nova', 'Zephyr', 'Atlas', 'Iris', 'Raven', 'Sol'];
  return nomes[Math.floor(Math.random() * nomes.length)];
}
function gerarCorAleatoria() {
  const cores = ['#ff6f61', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#00bcd4', '#e91e63', '#8bc34a'];
  return cores[Math.floor(Math.random() * cores.length)];
}



export default function ChatDialog() {
  const [open, setOpen] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState('');
  const [usuario] = useState(gerarNomeAleatorio());
  const [corUsuario] = useState(gerarCorAleatoria());
  const [socket, setSocket] = useState(null);
  const [salaAtual, setSalaAtual] = useState('global');
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const mensagensEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    // Receber mensagens
    newSocket.on('chatMessage', (msg) => {
      
      // só adiciona se for da sala atual
      if (msg.sala === salaAtual) {
        setMensagens((prev) => [...prev, msg]);
      }
    });

    // Receber lista de usuários online
    newSocket.on('usuariosOnline', (lista) => {
      setUsuariosOnline(lista);
    });

    // Registrar usuário
    newSocket.emit('registrarUsuario', { usuario, cor: corUsuario });

    // Entrar na sala global por padrão
    // newSocket.emit('joinRoom', 'global');

    return () => {
      newSocket.disconnect();
    };
  }, [usuario, corUsuario, salaAtual]);
  // console.log('UsuáriosOnline:', usuariosOnline);

  useEffect(() => {
    if (mensagensEndRef.current) {
      mensagensEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  // Entrar em sala privativa
  const entrarNaSalaPrivada = (destinatario) => {
    const roomName = `room-${usuario}-${destinatario}`;
    setSalaAtual(roomName);
    socket.emit('joinRoom', roomName);
    setMensagens([]); // limpa histórico local
  };

  const enviarMensagem = () => {
    if (input.trim() === '') return;
    const msg = { usuario, conteudo: input, sala: salaAtual, cor: corUsuario };
    socket.emit('chatMessage', msg);
    setInput('');
  };

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <ChatIcon />
      </IconButton>

      <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', backgroundColor: '#121212' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6">
              Chat em tempo real — Sala: {salaAtual}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
          {/* Lista de usuários */}
          <Box sx={{ width: '25%', borderRight: '1px solid #333', backgroundColor: '#1e1e1e' }}>
            <Typography variant="subtitle1" sx={{ p: 2, color: '#90caf9' }}>Usuários Online</Typography>
            <List>
              <ListItem button onClick={() => { setSalaAtual('global'); socket.emit('joinRoom', 'global'); setMensagens([]); }}>
                <ListItemText primary="Sala Global" sx={{ color: '#90caf9' }} />
              </ListItem>
              {usuariosOnline.map((u, i) => (
                <ListItem button key={i} onClick={() => entrarNaSalaPrivada(u.usuario)}>
                  <ListItemText primary={u.usuario} sx={{ color: u.cor }} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Área de mensagens */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', backgroundColor: '#1e1e1e' }}>
            {mensagens.map((m, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: m.usuario === usuario ? 'flex-end' : 'flex-start',
                  mb: 1
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    backgroundColor: m.usuario === usuario ? corUsuario : '#2c2c2c',
                    color: '#fff',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: m.cor || '#90caf9' }}>
                    {m.usuario}
                  </Typography>
                  <Typography variant="body1">{m.conteudo}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: '#b0bec5' }}>
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={mensagensEndRef} />
          </Box>
        </Box>

        {/* Campo de entrada */}
        <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #333', backgroundColor: '#121212' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{ style: { color: '#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
          />
          <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={enviarMensagem}>
            Enviar
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

