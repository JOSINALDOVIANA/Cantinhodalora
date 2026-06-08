import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  AvatarGroup,
  alpha,
  useTheme,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';



import { DadosContext } from '../../routs';
import { useNavigate } from 'react-router-dom';
import { url } from '../../api';
import { io } from 'socket.io-client';
import { green, red } from '@mui/material/colors';



export default function Chat() {
  const [newMensagem, setNewMensagem] = useState({ from: 'public', destino: 'all' });
  const [Dados, setDados] = React.useContext(DadosContext);
  const [input, setInput] = useState('');
  const [socketIo, setSocketIo] = useState(null);
  const listRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();



  useEffect(() => {
    const socket = io("wss://cantinhodalora.info", {
  transports: ["websocket"],   // força uso de WebSocket
  secure: true,                // garante SSL/TLS
  reconnection: true,          // tenta reconectar se cair
  reconnectionAttempts: 5,     // número de tentativas
  reconnectionDelay: 2000      // intervalo entre tentativas
});
    setSocketIo(socket);

    socket.on('connect', () => {
      // console.log(socket.id);
      setDados(a => ({ ...a, chat: { ...a.chat, user: { ...a.chat?.user, id: socket.id } } }));
      // console.log('Conectado ao servidor de chat');
    });

    socket.on('chatMessage', (msg) => {
      setDados((a) => ({ ...a, chat: { ...a.chat, mensagens: [...(a.chat?.mensagens || []), msg] } }));
    });
    socket.on('usuariosOnline', (usuarios) => {
      setDados(a => ({ ...a, chat: { ...a.chat, usuariosOnline: usuarios } }));
    });

    return () => {
      // remove listeners and disconnect to avoid duplicate connections
      socket.off('chatMessage');
      socket.off('connect');
      socket.off('usuariosOnline');
      try {
        socket.disconnect(Dados.chat?.user);
      } catch (e) {
        // ignore
      }
      setSocketIo(null);
    };
  }, []);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [Dados.chat?.mensagens]);

  console.log(Dados.chat);






  function handleSend() {
    if (!input.trim()) return;
    
    const novaMensagem = { text: input, from: newMensagem.from, destino: newMensagem.destino, Origem: Dados?.chat?.user };
    // setDados((a) => ({ ...a, chat: { ...a.chat, mensagens: [...(a.chat?.mensagens || []), novaMensagem] } }));
    setInput('');
    socketIo?.emit('chatMessage', novaMensagem);

  };



  return (
    <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', minHeight: '100vh', maxHeight: '100vh' }}>
      <Paper sx={{ width: '100%', maxWidth: 920, height: '98vh', display: 'flex', flexDirection: 'column' }} elevation={6}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <AvatarGroup max={4}>
              {Dados.chat?.usuariosOnline?.map((u) => (
                <Avatar key={u.id} sx={{ bgcolor: u.cor || 'primary.main' }}>{u.name[0].toUpperCase()}</Avatar>
              ))}
            </AvatarGroup>
            <Box>
              <Typography variant="subtitle1">Bem vindo ao Chat</Typography>
              <Typography variant="caption" color="text.secondary">{Dados.chat?.user?.name || 'Visitante'}</Typography>

            </Box>
          </Box>
        </Box>

        <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', p: 2, backgroundColor: 'background.default' }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Dados.chat?.mensagens?.map((m) => (
              <ListItem key={uuidv4()}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: m.Origem.id === Dados.chat?.user?.id ? 'flex-end' : 'flex-start',

                }}>

                  {/* // mensagens publicas */}
                {(m.from === 'public' || m.from === 'private' && m.Origem.id === Dados.chat.user.id) && (
                  <Paper e
                    levation={m.Origem.id === Dados.chat.user.id ? 3 : 1}
                    sx={{
                      p: 1.5,
                      maxWidth: '80%',
                      borderRadius: 2,
                      // backgroundColor: m.destino.id === Dados.chat.user.id ? 'primary.main' : 'background.paper',
                      // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2"
                      sx={{
                        fontWeight: 'bold',
                      }}>
                      {m.Origem?.name?.toUpperCase() || 'Desconecido'}  Para {m.destino === 'all' ? 'Todos' : m.destino.name.toUpperCase() || 'Desconecido'}
                    </Typography>
                    {m.Origem.id!==Dados?.chat?.user?.id && <LockIcon onClick={()=>{
                      setNewMensagem({ from: 'private', destino: m.Origem, Origem: Dados.chat.user });
                    }}  fontSize="small" sx={{ cursor: 'pointer', verticalAlign: 'middle', color: 'text.secondary' }} />}
                    </Box>
                    <Typography variant="body1">{m.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                )}

                {/* // mensagens privadas recebidas */}
                {m.from === 'private' && m.destino.id === Dados.chat.user.id && (
                  <Paper 
                  elevation={m.Origem.id === Dados.chat.user.id ? 3 : 1} 
                  sx={{ 
                    p: 1.5, 
                    maxWidth: '70%', 
                    borderRadius: 2, 
                    background: `linear-gradient(135deg, ${alpha(red[500], 50)}, ${red[500]} 0.25%, ${alpha(red[500], 0.25)})`,
                     }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {m.Origem?.name?.toUpperCase() || 'Desconecido'}  Para {m.destino === 'all' ? 'Todos' : m.destino.name.toUpperCase() || 'Desconecido'}
                    </Typography>
                      <LockIcon 
                      onClick={()=>{
                      setNewMensagem({ from: 'private', destino: m.Origem, Origem: Dados.chat.user });
                    }}
                      fontSize="small" 
                      sx={{ verticalAlign: 'middle', color: 'text.secondary' }} 
                      />
                    </Box>
                    <Typography variant="body1">{m.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                )}

              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton aria-label="attach">
            {newMensagem.from === 'private' ? <LockIcon onClick={() => {
              setNewMensagem({ from: 'public', destino: 'all', Origem: Dados.chat.user });
            }} color="error" /> : <LockOpenIcon color="warning" />}
          </IconButton>
           <ArrowForwardIcon color="primary" sx={{ transform: 'rotate(45deg)' }} />
           <Typography variant="caption" color="text.secondary">Enviando para: {newMensagem.destino === 'all' ? 'Todos' : newMensagem.destino.name}</Typography>

          <TextField
            placeholder="Escreva uma mensagem..."
            variant="outlined"
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // e.stopPropagation();
              // e.preventDefault();
              if (e.key === 'Enter') handleSend();
            }}
          />

          <IconButton color="primary" onClick={handleSend} aria-label="send">
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
      <Dialog open={openDialog} onClose={() => {
        !!Dados?.chat?.user ? setOpenDialog(false) : alert("Por favor, insira suas credenciais para acessar o chat.")
      }}>
        <DialogTitle>Insira suas credenciais para entrar no chat.</DialogTitle>
        <DialogContent>
          <TextField onChange={e => {
            setDados(a => ({ ...a, chat: { ...a.chat, user: { ...a.chat?.user, name: e.target.value } } }))
          }} autoFocus margin="dense" label="Nome/Apelido" type="text" fullWidth variant="standard" />
          <TextField onChange={e => {
            setDados(a => ({ ...a, chat: { ...a.chat, user: { ...a.chat?.user, cpf: e.target.value } } }))
          }} margin="dense" label="cpf" type="CPF" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
            <Button onClick={() => {
              // setDados(a => ({ ...a, chat: { user: { name: "Usuário", cpf: "000.000.000-00" } } }))
              if (!!Dados?.chat?.user?.name && !!Dados?.chat?.user?.cpf) {
                socketIo?.emit('registrarUsuario', Dados?.chat?.user);
                socketIo?.on('usuariosOnline', (usuarios) => {
                  setDados(a => ({ ...a, chat: { ...a.chat, usuariosOnline: usuarios, user: { ...a.chat?.user, id: socketIo?.id } } }));
                });

                setOpenDialog(false);
              } else {
                alert("Por favor, preencha ambos os campos para entrar no chat.")
              }
            }} variant="contained">Entrar</Button>
            <Button onClick={() => navigate("/")} variant="contained" color="error">
              Cancelar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

