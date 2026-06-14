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
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Avatar, CssBaseline, Dialog, InputAdornment, Paper } from '@mui/material';

import { deepOrange, green, blue, red, purple, teal } from '@mui/material/colors';

import ClearIcon from '@mui/icons-material/Clear';
import ListItemIcon from '@mui/material/ListItemIcon';
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


import { DadosContext, TrocarTheme } from '../../routs.js';
import { api } from '../../services/api/index.js';
import logo from '../../images/logo.png';
import { QRCodeCanvas } from "qrcode.react";
import SimpleDialogDemo from '../Mapa/index.js';

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
  const [searchValue, setSearchValue] = React.useState('')  
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

  // console.log(Dados)






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

      <Drawer sx={{}} open={openMenu} onClose={toggleOpenDrawerMenu(false)}>
        <Box sx={{ width: 250, minHeight: '100vh', maxHeight: '100vh' }} role="presentation" onClick={toggleOpenDrawerMenu(false)} onKeyDown={toggleOpenDrawerMenu(false)}>

          <List>
            {/* Login */}
            {!Dados?.logado && location.pathname !== '/login' &&
              <ListItem onClick={() => { navegation('/login') }} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon
                      sx={{
                        color: theme.palette.primary.main
                      }} />
                  </ListItemIcon>
                  <ListItemText primary='Login' />
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
                    <Logout sx={{ color: theme.palette.primary.main }} />
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
                    <Home sx={{ color: theme.palette.primary.main }} />
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
                    <FolderSpecial sx={{ color: theme.palette.primary.main }} />
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
                  <Wifi sx={{ color: theme.palette.primary.main }} />
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
                  <Dashboard sx={{ color: theme.palette.primary.main }} />
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
                  <People sx={{ color: theme.palette.primary.main }} />
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
                  <Settings sx={{ color: theme.palette.primary.main }} />
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
                  <ListIcon sx={{ color: theme.palette.primary.main }} />
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
                  <AddchartIcon sx={{ color: theme.palette.primary.main }} />
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
                  <Security sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary="Segurança" />
              </ListItem>
            }

            <Divider></Divider>



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
        position="fixed">
        <Toolbar>

          <IconButton
            size="large"
            edge="start"

            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleOpenDrawerMenu(true)}
          >
            <ListIcon />
          </IconButton>

          <IconButton
            onClick={() => { navegation('/chat') }}
            edge="start"
          >
            <ForumIcon />
          </IconButton>
          <SimpleDialogDemo />


          <TrocarTheme />
          <Search  sx={{ borderRadius: 999, display: { xs: 'none', md: 'flex' }, mx: 'auto' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              // disabled={load}
              value={searchValue}
              onChange={(e) => {
                e.preventDefault();
                setSearchValue(e.target.value);
                setDados(a=>({...a,productsSearch:a.products.filter(i=>i.name.toLowerCase().includes(e.target.value.toLowerCase()))}))

              }}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              endAdornment={
                searchValue && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchValue('');
                        setDados(a=>({...a,productsSearch:a.products}))
                      }}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          {/* tela grande */}

          <Box sx={{ flexShrink: 0, display: {}, flexDirection: 'column', alignItems: 'flex-end' }}>

            <Typography
              variant={isMobile ? "caption" : "subtitle1"}
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#ffffff" }}
            >
              <AccessTimeIcon fontSize="small" />
              · 10h até 2h
            </Typography>
          </Box>

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
