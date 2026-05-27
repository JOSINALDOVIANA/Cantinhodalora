import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddchartIcon from '@mui/icons-material/Addchart';

import ListIcon from '@mui/icons-material/List';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DadosContext, TrocarTheme } from '../../routs';
import { api } from '../../api/index.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, Paper } from '@mui/material';
import { ArrowBack, Call, Dashboard, FolderSpecial, Home, Logout, People, Security, Settings } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import useMediaQuery from "@mui/material/useMediaQuery";
import { deepOrange, green, blue, red, purple, teal } from '@mui/material/colors';

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
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

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

export default function PrimarySearchAppBar() {

  const [Dados, setDados] = React.useContext(DadosContext);
  const location = useLocation();
  const theme = useTheme();
  const navegation = useNavigate();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));



  const [openMenu, setOpenMenu] = React.useState(false);

  const toggleOpenDrawerMenu = (newOpen) => () => {
    setOpenMenu(newOpen);
  };
  const toggleCloseDrawerMenu = (newOpen) => () => {
    setOpenMenu(newOpen);
  };
  // menu atual
  const renderDrawerMenu = (
    <Box >
      {/* <Button onClick={toggleDrawer(true)}>Open drawer</Button> */}
      <Drawer sx={{}} open={openMenu} onClose={toggleOpenDrawerMenu(false)}>
        <Box sx={{ width: 250, minHeight: '100vh', maxHeight: '100vh' }} role="presentation" onClick={toggleOpenDrawerMenu(false)} onKeyDown={toggleOpenDrawerMenu(false)}>

          <List>
            {/* Login */}
            {!Dados?.logado && location.pathname !== '/login' &&
              <ListItem onClick={() => { navegation('/login') }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon sx={{ color: red[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={'Login'} />
                </ListItemButton>
              </ListItem>
            }

            {/* sair/logout */}
            {Dados?.logado &&
              <ListItem onClick={() => {
                api.post('/api/users/logout').then(response => {
                  if (response.status === 200) {
                    setDados({ ...Dados, logado: false, user: null });
                    navegation('/')
                  }
                }).catch(error => {
                  console.error(error);
                })
              }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Logout sx={{ color: red[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={'Sair'} />
                </ListItemButton>
              </ListItem>
            }

            {/* Home */}
            {location.pathname !== '/' &&
              <ListItem onClick={() => { navegation('/') }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Home sx={{ color: blue[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={'Home'} />
                </ListItemButton>
              </ListItem>
            }

            {/* Minha conta */}
            {Dados?.logado &&
              <ListItem onClick={() => { navegation('/minha-conta') }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FolderSpecial sx={{ color: teal[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={'Minha conta'} />
                </ListItemButton>
              </ListItem>
            }

            {/* Whatsapp, Facebook, Instagram e telefone */}
            <Divider />
            <ListItem onClick={() => { window.open('https://wa.me/5596981218004', '_blank') }} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <WhatsAppIcon sx={{ color: green[500] }} />
                </ListItemIcon>
                <ListItemText primary={'Whatsapp'} />
              </ListItemButton>
            </ListItem>

            <ListItem onClick={() => { window.open('https://www.facebook.com/CantinhoDaLora') }} disablePadding>
              <ListItemButton>
                <ListItemIcon >
                  <FacebookIcon sx={{ color: blue[500] }} />
                </ListItemIcon>''
                <ListItemText primary={'Facebook'} />
              </ListItemButton>
            </ListItem>

            <ListItem onClick={() => { window.open('https://www.instagram.com/josinaldo_viana') }} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InstagramIcon sx={{ color: purple[500] }} />
                </ListItemIcon>
                <ListItemText primary={'Instagram'} />
              </ListItemButton>
            </ListItem>

            <ListItem onClick={() => { window.open('tel:+5596981218004') }} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Call sx={{ color: deepOrange[500] }} />
                </ListItemIcon>
                <ListItemText primary={'(96) 98121-8004'} />
              </ListItemButton>
            </ListItem>

            {Dados?.logado && isSmallScreen && <Divider />}


            {/* Dashboard */}
            {Dados?.logado && Dados?.user?.adm &&
              <ListItem
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}

                selected={Dados?.activeTabPerfil === 'dashboard'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'dashboard' })}
              >
                <ListItemIcon>
                  <Dashboard sx={{ color: blue[500] }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

            }

            {/* User */}
            {Dados?.logado && Dados?.user?.adm &&
              <ListItem

                selected={Dados?.activeTabPerfil === 'users'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'users' })}
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}
              >
                <ListItemIcon>
                  <People sx={{ color: green[500] }} />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItem>
            }

            {/* Configurações */}
            {Dados?.logado &&
              <ListItem
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}

                selected={Dados?.activeTabPerfil === 'settings'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'settings' })}
              >
                <ListItemIcon>
                  <Settings sx={{ color: red[500] }} />
                </ListItemIcon>
                <ListItemText primary="Meus Dados" />
              </ListItem>
            }

            {/* Produtos */}
            {Dados?.logado && Dados?.user?.adm &&
              <ListItem
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}
                button
                selected={Dados?.activeTabPerfil === 'products'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'products' })}
              >
                <ListItemIcon>
                  <ListIcon sx={{ color: deepOrange[500] }} />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
              </ListItem>
            }

            {/* addProduto */}
            {Dados?.logado && Dados?.user?.adm &&
              <ListItem
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}

                selected={Dados?.activeTabPerfil === 'addProduct'}
                onClick={() => {
                  setDados({
                    ...Dados,
                    activeTabPerfil: 'addProduct',
                    editProduct: {
                      id: null,
                      description: "",
                      size: 0,
                      price: 0,
                      url: "",
                      images: [],
                      image_id: "",
                      name: "",
                      categorias: []
                    },
                    upProduct: true,
                  });

                }}
              >
                <ListItemIcon>
                  <AddchartIcon sx={{ color: teal[500] }} />
                </ListItemIcon>
                <ListItemText primary="AddProduto" />
              </ListItem>
            }

            {/* segurança */}
            {Dados?.logado &&
              <ListItem
                sx={{ display: { md: "none" }, mb: 1, borderRadius: 2 }}

                selected={Dados?.activeTabPerfil === 'security'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'security' })}
              >
                <ListItemIcon>
                  <Security sx={{ color: purple[500] }} />
                </ListItemIcon>
                <ListItemText primary="Segurança" />
              </ListItem>
            }

            <Divider></Divider>
            {/* categorias */}
            <ListItem

              sx={{ mb: 1, borderRadius: 2, cursor: 'pointer' }}

              onClick={() => { setDados(a => ({ ...a, productsSearch: [...a.products] })) }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ArrowBack sx={{ color: purple[500] }} />
                </ListItemIcon>
                <ListItemText primary={'Todos os Produtos'} />
              </ListItemButton>
            </ListItem>

            {Dados?.categories?.map((categoria, index) => (
              <ListItem
                sx={{ mb: 1, borderRadius: 2, cursor: 'pointer' }}

                key={categoria.id}

                onClick={() => {
                  let prod = Dados?.products?.filter(p => p.categories?.find(c => c.id === categoria.id))

                  console.log('selectCategorie', prod)
                  setDados(a => ({ ...a, productsSearch: [...prod] }))


                }
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <ArrowBack sx={{ color: purple[500] }} />
                  </ListItemIcon>
                  <ListItemText primary={categoria.description} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>





        </Box>
      </Drawer>
    </Box>
  );




  return (
    <>
      <CssBaseline />
      <AppBar
        elevation={0}
        sx={{
          // background: 'rgba(236, 59, 59, 0.65)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',

        }}
        position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            // color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleOpenDrawerMenu(true)}
          >
            <ListIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { sm: 'block' } }}
          >
            Cantinho da Lora
          </Typography>
          <Search sx={{ display: { xs: 'none', md: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          {/* tela grande */}
          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex'
            }
          }}>



            <TrocarTheme />

            {/* <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            {/* {Dados?.logado ?
              <Avatar onClick={handleProfileMenuOpen} alt='csccaasc' src={Dados.user?.url} ></Avatar>
              : <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>} */}

          </Box>

          {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
      {/* {renderDrawerOptions} */}
      {renderDrawerMenu}
      {/* {renderMobileMenu} */}
      {/* {renderMenu} */}

    </>


  );
}
