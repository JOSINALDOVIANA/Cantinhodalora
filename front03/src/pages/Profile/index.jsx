import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uniqueId } from 'lodash';
import { deepOrange, green, blue, red, purple } from '@mui/material/colors';
import {
    Container,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    ImageList,
    useTheme,
    AvatarGroup,
    CssBaseline,
    InputAdornment,
    OutlinedInput,
    InputLabel,
    FormControl,
    CircularProgress,
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import {
    Dashboard,
    People,
    Settings,
    Edit,
    Delete,
    Add,
    Security,
    PhotoCamera,

    Done,
    DoneAll,
    Cancel,
    Save,

    DeleteForever,
    VisibilityOff,
    Visibility,
    Wifi,
    Category,
    Image,

} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import AddchartIcon from '@mui/icons-material/Addchart';

import { DadosContext } from '../../services/Contexts/DadosContext.jsx';
import { api } from '../../services/api.jsx';
import DashboardPage from './Dashboard.jsx';

import Swal from 'sweetalert2'

import { useRefreshUser } from '../../services/UseQuery/UsersQuery.jsx';
import Users from './users.jsx';
import { useLoadProducts } from '../../services/UseQuery/ProductsQuery.jsx';

import CategoriesManager from '../../components/Grud/grudCategories.jsx';
import ProductsManager from '../../components/Grud/grudProducts.jsx';
import WifiManager from '../../components/Grud/grudWifi.jsx';
import ImagesManager from '../../components/Grud/grudImages.jsx';



export default function AdminPanel() {
    const { products } = useLoadProducts();

    const { user } = useRefreshUser();
    const theme = useTheme();

    const { Dados, setDados } = React.useContext(DadosContext);

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    



    React.useEffect(() => {
        if (!Dados?.logado && !!!user) {
            Swal.fire({
                title: "Erro",
                text: "Você não tem permissão para acessar esta página!",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#050505",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
            return; // Impede que o restante do useEffect seja executado se não estiver logado
        }
        setDados(a => ({ ...a, activeTabPerfil: 'dashboard' }));        
    }, []);


    return (
        <Container component={Box} disableGutters sx={{ mt: 8, p: 4, display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 4, minHeight: '100vh', minWidth: '100%' }}>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, minWidth: '200px' }}>
                <Box sx={{ mb: 0 }}>
                    <Avatar src={user?.url} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                    <Typography align="center">{user?.name}</Typography>
                </Box>

                <List>

                    
                    {/* //dashboard */}
                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'dashboard'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'dashboard' }))}
                        >
                            <ListItemIcon><Dashboard /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem> : null}

                    {/* //users */}
                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'users'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'users' }))}
                        >
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Usuários" />
                        </ListItem> : null}


                    {/* //products */}
                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'products'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'products' }))}
                        >
                            <ListItemIcon><ListIcon /></ListItemIcon>
                            <ListItemText primary="Produtos" />
                        </ListItem> : null}


                    {/* //categories */}
                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'Categories'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'Categories' }))}
                        >
                            <ListItemIcon><Category /></ListItemIcon>
                            <ListItemText primary="Categorias" />
                        </ListItem> : null}                 

                  

                    {/* wificonfigs */}
                    <ListItem

                        selected={Dados?.activeTabPerfil === 'security'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'WifiConfigs' }))}
                    >
                        <ListItemIcon>
                            <Wifi />
                        </ListItemIcon>
                        <ListItemText primary="WiFi" />
                    </ListItem>

                    {/* images */}
                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'images'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'images' }))}
                        >
                            <ListItemIcon><Image /></ListItemIcon>
                            <ListItemText primary="Imagens" />
                        </ListItem> : null}  
                </List>
            </Box>

            <Box sx={{ flexGrow: 1 }}>

                {Dados?.activeTabPerfil === 'dashboard' && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexFlow: 1,
                            flex: 1
                        }}
                    >
                        <DashboardPage />
                    </Box>
                    // <CategoriesManager />
                )}
                {Dados?.activeTabPerfil === 'Categories' && (
                    // <Box
                    //     sx={{
                    //         display: 'flex',
                    //         justifyContent: 'center',
                    //         alignItems: 'center',
                    //         flexFlow: 1,
                    //         flex: 1
                    //     }}
                    // >
                    //     <DashboardPage />
                    // </Box>
                    <CategoriesManager />
                )}

                {Dados?.activeTabPerfil === 'users' && (
                    <Users />
                )}


                {Dados?.activeTabPerfil === 'products' && (
                    // <Products />
                    <ProductsManager />
                )}                

                {Dados?.activeTabPerfil === 'WifiConfigs' && (
                    <WifiManager />
                )}

                {Dados?.activeTabPerfil === 'images' && (
                    
                    <ImagesManager />
                )}



            </Box>


            
           




        </Container >
    );
}
