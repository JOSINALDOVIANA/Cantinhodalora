import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
import { io } from 'socket.io-client';
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
import { green, red } from '@mui/material/colors';

import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';



import { DadosContext } from '../../services/Contexts/DadosContext.jsx'
import { url } from '../../services/api.jsx';
import gerarCorAleatoriaRGB from '../../functions/RandomColors.jsx';



export default function Chat() {
  const [newMensagem, setNewMensagem] = useState({ from: 'public', destino: 'all', origem: {} });
  const { Dados, setDados } = React.useContext(DadosContext);
  const [input, setInput] = useState('');
  const [socketIo, setSocketIo] = useState(null);
  const listRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const PersonalCores = {
    palette: {
      primary: {
        main: '#a09d9d', // Azul claro
      },
      secondary: {
        main: '#f3ecec', // Verde menta
      },
      background: {
        default: '#F5F5F5', // Fundo suave
        paper: '#FFFFFF',
      },
      text: {
        primary: '#424242', // Texto escuro
        secondary: '#757575',
      },
      warning: {
        main: '#FFCCBC', // Pêssego suave
      },
    },
  };



  useEffect(() => {
    // vps
    const socket = window.location.origin.includes('localhost') ? io(url) : io("wss://cantinhodalora.info", {
      transports: ["websocket"],   // força uso de WebSocket
      secure: true,                // garante SSL/TLS
      reconnection: true,          // tenta reconectar se cair
      reconnectionAttempts: 5,     // número de tentativas
      reconnectionDelay: 2000      // intervalo entre tentativas
    });

    setSocketIo(socket);

    socket.on('connect', () => {

      setDados(a => ({ ...a, chat: { ...a.chat, user: { ...a.chat?.user, id: socket.id, color: gerarCorAleatoriaRGB() } } }));

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

  // console.log(Dados.chat);






  function handleSend() {
    if (!input.trim()) return;

    const novaMensagem = { text: input, from: newMensagem.from, destino: newMensagem.destino, origem: Dados?.chat?.user };

    setInput('');
    socketIo?.emit('chatMessage', novaMensagem);

  };



  return (
    <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', minHeight: '100vh', maxHeight: '100vh' }}>
      <Paper sx={{ width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 5 }} elevation={1}>
        {/*cabeçalho */}
        <Box component={Paper} elevation={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: 2, borderBottom: '1px solid', borderColor: 'divider', borderRadius: '20px 20px 0 0' }}>
          <Box>
            <Typography variant="subtitle1">Bem vindo ao Chat</Typography>
            <Typography variant="caption" >{Dados.chat?.user?.name || 'Visitante'}</Typography>

          </Box>
          <AvatarGroup max={4}>
            {Dados.chat?.usuariosOnline?.map((u) => (
              <Avatar key={u.id} sx={{ bgcolor: u.cor || 'primary.main' }}>{u.name[0].toUpperCase()}</Avatar>
            ))}
          </AvatarGroup>
        </Box>

        {/* area das mensgaens */}
        <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', p: 2, backgroundColor: '#d5d5d5' }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

            {Dados?.chat?.mensagens?.map((m) => (
              <ListItem key={uuidv4()}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',

                  // isso vai controlar o lado que aparece a mensgem 
                  justifyContent: m?.origem?.id === Dados.chat?.user?.id ? 'flex-end' : 'flex-start',

                }}>

                {/* se eu sou o emissor =>enviadas*/}
                {(m?.origem?.id === Dados?.chat?.user?.id) && (
                  <Paper
                    elevation={2}
                    sx={{
                      overflow: 'hidden',
                      p: 1.5,
                      maxWidth: '80%',
                      borderRadius: 2,
                      backgroundColor: m?.destino?.color
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flex: 1 }}>
                      <Typography variant="body2"
                        sx={{
                          fontWeight: 'bold',
                        }}>
                        {m?.origem?.name?.toUpperCase() || 'Desconecido'} {m?.from === 'private' ? 'privado' : null}  Para {m?.destino === 'all' ? 'Todos' : m?.destino.name.toUpperCase() || 'Desconecido'}
                      </Typography>

                    </Box>
                    <Typography sx={{ flex: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }} variant="body1">{m.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                      {new Date().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                )}

                {/* se não sou o emissor e é publica =>recebidas*/}

                {(m.from === 'public' && m?.origem?.id !== Dados?.chat?.user?.id) &&
                  <Paper
                    onClick={() => {
                      // console.log(m.origem);
                      setNewMensagem(a => ({ ...a, destino: m.origem }));
                    }}
                    elevation={1}
                    sx={{
                      cursor: "pointer",
                      overflow: 'hidden', // evita transbordo interno
                      p: 1.5,
                      maxWidth: '70%',
                      borderRadius: 2,
                      backgroundColor: m?.origem?.color
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {m?.origem?.name?.toUpperCase() || 'Desconecido'} {m?.from === 'private' ? 'privado' : null}  Para {m?.destino === 'all' ? 'Todos' : m?.destino?.name?.toUpperCase() || 'Desconecido'}
                      </Typography>

                    </Box>
                    <Typography sx={{ flex: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }} variant="body1">{m.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                      {new Date().toLocaleTimeString()}
                    </Typography>

                  </Paper>
                }

                {/* se não sou o emissor e é privado =>recebidas*/}

                {m?.from === 'private' && m?.destino?.id === Dados?.chat?.user?.id &&
                  <Paper
                    onClick={() => {

                      setNewMensagem(a => ({ ...a, destino: m.origem }));
                    }}
                    elevation={1}
                    sx={{
                      cursor: "pointer",
                      overflow: 'hidden', // evita transbordo interno
                      p: 1.5,
                      maxWidth: '70%',
                      borderRadius: 2,
                      backgroundColor: m?.origem?.color
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {m?.origem?.name?.toUpperCase() || 'Desconecido'} {m?.from === 'private' ? 'privado' : null}  Para {m?.destino === 'all' ? 'Todos' : m?.destino?.name?.toUpperCase() || 'Desconecido'}
                      </Typography>

                    </Box>
                    <Typography sx={{ flex: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }} variant="body1">{m.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}>
                      {new Date().toLocaleTimeString()}
                    </Typography>

                  </Paper>
                }

              </ListItem>
            ))}
          </List>
        </Box>
        {/* //botons */}
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton aria-label="attach">
            {newMensagem.from === 'private' ? <LockIcon onClick={() => {
              setNewMensagem({ from: 'public', destino: 'all' });
            }} color="error" /> : <LockOpenIcon onClick={() => { setNewMensagem(a => ({ ...a, from: 'private' })) }} color="warning" />}
          </IconButton>
          <ArrowForwardIcon color="primary" sx={{ transform: 'rotate(45deg)' }} />
          <Typography variant="caption" color="text.secondary">Enviando {newMensagem.from === "private" ? 'privado' : null} para: {newMensagem.destino === 'all' ? 'Todos' : newMensagem.destino.name}</Typography>

          <TextField
            placeholder="Escreva uma mensagem..."
            variant="outlined"
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />

          <IconButton color="primary" onClick={handleSend} aria-label="send">
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          // Impede fechar ao clicar fora ou apertar ESC
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
          setOpenDialog(false);
        }}

        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: 400,
            minHeight: 500,
            background: 'linear-gradient(135deg, #E3F2FD, #FCE4EC)',
          },
        }}
      >
        <DialogTitle>
          <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Entrar
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              helperText="Pode ser um nome fictício "
              label="Nome/apelido"
              type="tsxt"
              fullWidth
              value={Dados?.chat?.user?.name}
              onChange={(e) => {
                setDados(a => ({ ...a, chat: { ...a.chat, user: { ...a.chat?.user, name: e.target.value } } }))
              }}
            />

          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {

              if (!!Dados?.chat?.user?.name) {
                socketIo?.emit('registrarUsuario', Dados?.chat?.user);
                socketIo?.on('usuariosOnline', (usuarios) => {
                  setDados(a => ({ ...a, chat: { ...a?.chat, usuariosOnline: usuarios, user: { ...a?.chat?.user, id: socketIo?.id } } }));
                });

                setOpenDialog(false);
              } else {
                alert("Por favor, preencha ambos os campos para entrar no chat.")
              }
            }}
          >
            Entrar
          </Button>
          <Button variant='outlined' onClick={(e) => { e.preventDefault(); setOpenDialog(false); navigate('/') }} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

