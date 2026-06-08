import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import AddchartIcon from '@mui/icons-material/Addchart';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Avatar, CssBaseline, Dialog, Paper } from '@mui/material';
import { deepOrange, green, blue, red, purple, teal } from '@mui/material/colors';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LoginIcon from '@mui/icons-material/Login';
import ForumIcon from '@mui/icons-material/Forum';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ArrowBack, Call, Dashboard, DialerSip, FolderSpecial, Home, Logout, People, Security, Settings, Wifi } from '@mui/icons-material';


import { DadosContext, TrocarTheme } from '../../routs';
import { api } from '../../api/index.js';
import logo from '../../images/logo.png';
import { QRCodeCanvas } from "qrcode.react";

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  React.useEffect(() => {
    api.get('/api/wifi').then(response => {
      // console.log('wifiConfig', response.data.wifiConfigs[0]);
      setDados(a => ({ ...a, wifiConfig: response.data.wifiConfigs[0] }));
    }).catch(error => {
      console.error(error);
    })
  }, []);
 
  

  


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

            <ListItem onClick={() => {
              setDados(a => ({ ...a, openWifi: true }))
            }
            } disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Wifi sx={{ color: deepOrange[500] }} />
                </ListItemIcon>
                <ListItemText primary={'Conectar'} />
              </ListItemButton>
            </ListItem>

            {Dados?.logado && isMobile && <Divider />}


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

                  // console.log('selectCategorie', prod)
                  setDados(a => ({ ...a, productsSearch: [...prod] }))


                }
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    {/* {(() => {
                      const icons = [Home, Dashboard, FolderSpecial, People, Security, Settings, Call, AddchartIcon];
                      const Icon = icons[index % icons.length];
                      return <Icon sx={{ color: purple[500] }} />;
                    })()} */}
                    <SportsBarOutlinedIcon sx={{ color: purple[100] }} />
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
          // backdropFilter: 'blur(12px)',
          // borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
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

          <IconButton
          onClick={() => { navegation('/chat') }}
            
            edge="start">
              <ForumIcon sx={{  mr: 1, color: deepOrange[500] }} />
            </IconButton>

          
          <TrocarTheme />
          <Search sx={{ borderRadius: 999, display: { xs: 'none', md: 'flex' }, flexGrow: 1, maxWidth: 460, mx: 'auto' }}>
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

          <Box sx={{ flexShrink: 0, display: {}, flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant={isMobile ? "body1" : "h4"} sx={{ lineHeight: 1.1, }}>
              Cantinho da Lora
            </Typography>
            <Typography
              variant={isMobile ? "caption" : "subtitle1"}
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <AccessTimeIcon fontSize="small" />
              · 10h até 2h
            </Typography>
          </Box>
          {/* <Avatar
            variant="circular"
            sx={{
              ml: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              width: 44,
              height: 44,
              boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            <img src={logo} alt="Logo" style={{ width: "100%", height: "100%" }} />
          </Avatar> */}


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

      {renderDrawerMenu}

      <Dialog open={Dados?.openWifi} onClose={() => setDados({ ...Dados, openWifi: false })}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>
            Conectar ao Wi-Fi
          </Typography>
          <Typography variant="body1" gutterBottom>
            Escaneie o QR Code abaixo para se conectar à rede Wi-Fi do Cantinho da Lora.
          </Typography>
          <QRCodeCanvas
            value={`WIFI:T:${Dados?.wifiConfig?.encryption};S:${Dados?.wifiConfig?.ssid};P:${Dados?.wifiConfig?.password};;`}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={true}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Rede: {Dados?.wifiConfig?.ssid} <br />
            Senha: {Dados?.wifiConfig?.password}
          </Typography>
          {/* <a href={`intent://WIFI::${Dados?.wifiConfig?.encryption};S:${Dados?.wifiConfig?.ssid};P:${Dados?.wifiConfig?.password};;`}>
            Conectar ao Wi-Fi
          </a> */}
        </Paper>
      </Dialog>


    </>


  );
}
