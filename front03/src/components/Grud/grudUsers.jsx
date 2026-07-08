import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Avatar,
  Chip,
  FormControlLabel,
  Switch,
  MenuItem,
  styled,
  InputBase,
  alpha,
  Tooltip,
  Zoom,
  Divider,
  AvatarGroup,
  CircularProgress,
  Grid,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear,
  Refresh

} from '@mui/icons-material';
import { useAddUser, useDeleteUser, useFetchUsersSystem } from '../../services/UseQuery/UsersQuery';

import { LoadImagesUsers } from '../../services/UseQuery/ImagesQuery';
import Swal from 'sweetalert2';
import UploadImageUser from '../../functions/UploadImageProd';


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  //   right: 1,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

}));

export default function UserManagement() {
  const { usersSystem, refetchUsersSystem } = useFetchUsersSystem();
  const { imagesUsers, loadingImagesUsers, refetchImagesUsers } = LoadImagesUsers();
  const userAdd = useAddUser();
  const deleteUser = useDeleteUser();
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para o Modal (Formulário)
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    status: 1,
    adm: 0,
    url: ''
  });

  const [openImageModal, setOpenImageModal] = useState(false);

  // Filtrar usuários por nome ou email
  const filteredUsers = usersSystem?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentUser({ id: null, name: '', email: '', password: '', status: 1, adm: 0, url: '' });
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser({ ...user, password: '' }); // Evita expor o hash original no input diretamente
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {}else{
      userAdd.mutate(currentUser, {
        onSuccess: () => {
          refetchUsersSystem();
        },
      });
    }
    handleCloseModal();
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Tem certeza?",
      text: `Deseja excluir o usuário ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate(user, {
          onSuccess: () => {
            Swal.fire(
              "Excluído!",
              `O usuário ${user.name} foi excluído.`,
              "success"
            );
            refetchUsersSystem(); 
          },onError: () => {
            Swal.fire(
              "Erro!",
              `Não foi possível excluir o usuário ${user.name}.`,
              "error"
            );
          }
        });
      }
    });
  };

  const handleToggleImage = (img) => {
        if (isEditing) {
            const exists = currentUser.images?.some(item => item.id === img.id);
            if (exists) {
                setCurrentUser(prev => ({
                    ...prev,
                    image_id: prev.image_id == img.id ? "" : prev.image_id,
                    images: prev.images.filter(item => item.id !== img.id)
                }));
            } else {
                setCurrentUser(prev => ({
                    ...prev,
                    images: [...(prev.images || []), img],
                    image_id: img.id
                }));

            }
        } else {
            const exists = currentUser.images?.some(item => item.id === img.id);
            if (exists) {
                setCurrentUser(prev => ({
                    ...prev,
                    image_id: prev.image_id == img.id ? "" : prev.image_id,
                    images: prev.images.filter(item => item.id !== img.id)
                }));
            } else {
                setCurrentUser(prev => ({
                    ...prev,
                    images: [...(prev.images || []), img],
                    image_id: img.id
                }));

            }
        }
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4,bgcolor:"background.paper", p:3, borderRadius:2, boxShadow: 3 }}>
      {/* cabeçalho */}
      <Box sx={{
        display:'flex', justifyContent:"space-between", alignItems:"center" ,mb:3, gap:2, flexWrap:"wrap"
      }}>
        <Typography variant="h4" component="h1"  sx={{ fontWeight: 'bold' }}>
          Gestão de Usuários
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ ml: 'auto' }}
        >
          Novo Usuário
        </Button>
        <Tooltip title="Atualizar Lista" arrow 
        // TransitionComponent={Zoom}
        >
          <IconButton
            onClick={() => refetchUsersSystem()}
            color="primary"
            sx={{
              ml: 1,
              border: "1px solid",
              borderColor: "primary.light",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                transform: "rotate(45deg)",
              },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>


      <Search sx={{ borderRadius: 999, mx: 'auto', mt: 3, mb: 3, width: { xs: '100%', sm: 'auto' } }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          // disabled={load}
          value={searchTerm}
          onChange={(e) => {
            e.preventDefault();
            setSearchTerm(e.target.value)

          }}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search', display: 'flex' }}
          endAdornment={
            searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchTerm('')}
                  edge="end"
                  size="small"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Search>

      {/* Tabela de Usuários */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{}}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Foto</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Nível</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Avatar src={user.url} alt={user.name}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell style={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.adm === 1 ? 'Administrador' : 'Usuário'}
                      color={user.adm === 1 ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === 1 ? 'Ativo' : 'Inativo'}
                      color={user.status === 1 ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEdit(user)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user)} title="Excluir">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Formulário */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <form sx={{
          p:1,gap:2
        }} onSubmit={handleSave}>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogContent dividers>
            <Box  sx={{
              display:'flex', 
              flexDirection:"column",
              gap:2
            }}>
              <TextField
                label="Nome Completo"
                required
                fullWidth
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
              <TextField
                label="E-mail"
                type="email"
                required
                fullWidth
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
              <TextField
                label={isEditing ? "Nova Senha (deixe em branco para não alterar)" : "Senha"}
                type="password"
                required={!isEditing}
                fullWidth
                value={currentUser.password}
                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
              />
              {/* <TextField
                label="URL da Imagem de Perfil"
                fullWidth
                placeholder="https://exemplo.com/foto.jpg"
                value={currentUser.url}
                onChange={(e) => setCurrentUser({ ...currentUser, url: e.target.value })}
              /> */}
              <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography>Imagens: </Typography>
                <Box sx={{ display: 'flex', flexDirection: "row", overflowX: 'auto', maxWidth: '100%', py: 1, scrollbarWidth: 'thin' }}>
                  <AvatarGroup sx={{ flexDirection: "row" }}>
                    {currentUser?.images?.map((img, index) => (
                      <Avatar
                        // color={img.id === Dados?.ProductDataEdit?.image_id ? "red" : ""}
                        onClick={() => {

                          setCurrentUser(a => ({ ...a, images: a.images?.filter(i => i.id !== img.id) }))

                        }}

                        key={index}
                        src={img?.url}
                        sx={{ width: 50, height: 50, border: img.id === currentUser?.image_id ? "2px solid red !important" : undefined, flexShrink: 0 }}
                      />
                    ))}
                  </AvatarGroup>
                </Box>

                <Divider flexItem variant="middle" sx={{ mt: 2 }} />
                <Box
                  sx={{
                    gap: 2,
                    display: 'flex',
                    // flexDirection: isSmallScreen ? 'column' : 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Button variant='contained' onClick={() => {

                    setOpenImageModal(true);
                  }}

                    sx={{ mt: 2 }}
                  >
                    Selecionar
                  </Button>

                  <UploadImageUser props={{ upUrl: "/api/images/uploadUser" ,refetchImages: () => refetchImagesUsers() }} />
                  

                </Box>
              </Box>

              <TextField
                select
                label="Tipo de Conta"
                value={currentUser.adm}
                onChange={(e) => setCurrentUser({ ...currentUser, adm: Number(e.target.value) })}
                fullWidth
              >
                <MenuItem value={0}>Usuário Comum</MenuItem>
                <MenuItem value={1}>Administrador</MenuItem>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={currentUser.status === 1}
                    onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.checked ? 1 : 0 })}
                    color="success"
                  />
                }
                label={currentUser.status === 1 ? "Usuário Ativo" : "Usuário Inativo"}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal de seleção de imagens */}
      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Selecionar Imagens do Produto</DialogTitle>
        <DialogContent dividers>
          {loadingImagesUsers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : imagesUsers && imagesUsers?.length > 0 ? (
            <Grid container spacing={2}>
              {imagesUsers?.map((img) => {
                const isSelected = isEditing ? currentUser.images?.some((item) => item.id === img.id) : currentUser.images?.some((item) => item.id === img.id);
                return (
                  <Grid item xs={6} sm={4} md={3} key={img.id || img.key}>
                    <Box
                      onClick={() => handleToggleImage(img)}
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "3px solid",
                        borderColor: isSelected ? "primary.main" : "transparent",
                        boxShadow: isSelected ? 4 : 1,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <img
                        src={img.urlfull || img.url}
                        alt={img.name}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {/* Checkbox overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: isSelected ? "primary.main" : "rgba(0, 0, 0, 0.4)",
                          borderRadius: "50%",
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          boxShadow: 1,
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={!!isSelected}
                          sx={{
                            color: "white",
                            p: 0,
                            "&.Mui-checked": {
                              color: "white",
                            },
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleToggleImage(img)}
                        />
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          p: 0.5,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" noWrap sx={{ display: "block" }}>
                          {img.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              Nenhuma imagem encontrada.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageModal(false)} variant="contained" color="primary">
            Concluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}