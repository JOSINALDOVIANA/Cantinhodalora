import React, { useState, useEffect, useContext } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    ListItemButton,
    Divider,
    InputBase,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import { styled, alpha, useTheme, createTheme } from '@mui/material/styles';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Home from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import FolderSpecial from '@mui/icons-material/FolderSpecial';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import Settings from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';
import Security from '@mui/icons-material/Security';
import AddchartIcon from '@mui/icons-material/Addchart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Call from '@mui/icons-material/Call';

import { api } from '../../api/index.js';
import { DadosContext, Url_img, TrocarTheme } from '../../routs.js';
import { useNavigate, useLocation } from 'react-router-dom';

const elegantTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#bb86fc' },
        background: { default: '#121212', paper: '#1e1e1e' },
    },
    typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
});

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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Teste = () => {
    const [Dados, setDados] = useContext(DadosContext) || [{}, () => { }];
    const navegation = useNavigate();
    const location = useLocation();
    const muiTheme = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Busca de produtos idêntica ao grid.js original
        api.get('/api/products')
            .then(response => {
                setProducts(response.data.produtos || []);
                if (setDados) setDados(a => ({ ...a, products: response.data.produtos }));
            })
            .catch(err => console.log('Erro ao carregar produtos', err));
    }, [setDados]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <ThemeProvider theme={elegantTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

                {/* AppBar Elegante integrado com a Barra de Pesquisa Original */}
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        background: 'rgba(18, 18, 18, 0.65)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                            Cantinho da Lora
                        </Typography>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Pesquisar..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
                            {/* O botão real de trocar o tema da sua aplicação */}
                            <TrocarTheme />
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Drawer com Lógica Real de Login, Navegação e Permissões Administrativas */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 280 }}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        <List sx={{ mt: 2 }}>
                            {!Dados?.logado && location.pathname !== '/login' && (
                                <ListItem onClick={() => navegation('/login')} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon><LoginIcon /></ListItemIcon>
                                        <ListItemText primary="Login" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {Dados?.logado && (
                                <ListItem onClick={() => {
                                    setDados({ ...Dados, logado: false, user: null });
                                    navegation('/');
                                }} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon><Logout /></ListItemIcon>
                                        <ListItemText primary="Sair" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {location.pathname !== '/' && (
                                <ListItem onClick={() => navegation('/')} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon><Home /></ListItemIcon>
                                        <ListItemText primary="Home" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            {Dados?.logado && (
                                <ListItem onClick={() => navegation('/minha-conta')} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon><FolderSpecial /></ListItemIcon>
                                        <ListItemText primary="Minha conta" />
                                    </ListItemButton>
                                </ListItem>
                            )}

                            <Divider sx={{ my: 1 }} />

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><WhatsAppIcon /></ListItemIcon>
                                    <ListItemText primary="Whatsapp" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><FacebookIcon /></ListItemIcon>
                                    <ListItemText primary="Facebook" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><InstagramIcon /></ListItemIcon>
                                    <ListItemText primary="Instagram" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon><Call /></ListItemIcon>
                                    <ListItemText primary="(96) 98121-8004" />
                                </ListItemButton>
                            </ListItem>

                            {Dados?.logado && <Divider sx={{ my: 1 }} />}

                            {Dados?.logado && (
                                <>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'dashboard'} onClick={() => setDados({ ...Dados, activeTabPerfil: 'dashboard' })}>
                                        <ListItemIcon><Dashboard /></ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItem>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'users'} onClick={() => setDados({ ...Dados, activeTabPerfil: 'users' })}>
                                        <ListItemIcon><People /></ListItemIcon>
                                        <ListItemText primary="Usuários" />
                                    </ListItem>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'settings'} onClick={() => setDados({ ...Dados, activeTabPerfil: 'settings' })}>
                                        <ListItemIcon><Settings /></ListItemIcon>
                                        <ListItemText primary="Configurações" />
                                    </ListItem>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'products'} onClick={() => setDados({ ...Dados, activeTabPerfil: 'products' })}>
                                        <ListItemIcon><ListIcon /></ListItemIcon>
                                        <ListItemText primary="Produtos" />
                                    </ListItem>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'addProduct'} onClick={() => {
                                        setDados({
                                            ...Dados,
                                            activeTabPerfil: 'addProduct',
                                            editProduct: { id: "", description: "", size: "", price: "", url: "", images: [], image_id: "", name: "", categorias: [] }
                                        });
                                    }}>
                                        <ListItemIcon><AddchartIcon /></ListItemIcon>
                                        <ListItemText primary="AddProduto" />
                                    </ListItem>
                                    <ListItem button selected={Dados?.activeTabPerfil === 'security'} onClick={() => setDados({ ...Dados, activeTabPerfil: 'security' })}>
                                        <ListItemIcon><Security /></ListItemIcon>
                                        <ListItemText primary="Segurança" />
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Box>
                </Drawer>

                {/* Grid de Produtos - Baseado no card/grid.js e card/index.js originais */}
                <Box component="main" sx={{ pt: 12, pb: 6 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                            {products.map((produto, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            minWidth: 250,
                                            maxWidth: 250,
                                            margin: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={produto?.url || Url_img}
                                            alt={produto?.name}
                                            sx={{
                                                width: "100%",
                                                height: 200,
                                                WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${muiTheme.palette.mode === "dark" ? "#000" : "#fff"} 20%)`
                                            }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {produto?.name} {produto?.size}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Estoque: {produto?.unit || 0} unidades
                                            </Typography>
                                            <Typography variant="h6" color="warning.main" sx={{ mt: 1 }}>
                                                R$ {produto?.price ? produto.price.toFixed(2) : '0.00'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            {products.length === 0 && (
                                <Typography color="text.secondary" sx={{ mt: 5 }}>Carregando produtos...</Typography>
                            )}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Teste;
