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



export default function AdminPanel() {
    const { products } = useLoadProducts();

    const { user } = useRefreshUser();
    const theme = useTheme();

    const { Dados, setDados } = React.useContext(DadosContext);

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));






    const [openDialog, setOpenDialog] = useState(false);// para adicionar usuário
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const [openDialog2, setOpenDialog2] = useState(false);// para editar produto
    const handleOpenDialog2 = () => setOpenDialog2(true);
    const handleCloseDialog2 = () => setOpenDialog2(false);

    const [openDialog3, setOpenDialog3] = useState(false);// para abrir as imagens do produto
    const handleOpenDialog3 = () => setOpenDialog3(true);
    const handleCloseDialog3 = () => setOpenDialog3(false);

    const [openDialog4, setOpenDialog4] = useState(false);// para abrir as categorias do produto
    const handleOpenDialog4 = () => setOpenDialog4(true);
    const handleCloseDialog4 = () => setOpenDialog4(false);

    const [openDialog5, setOpenDialog5] = useState(false);// para abrir as imagens do usuário
    const handleOpenDialog5 = () => setOpenDialog5(true);
    const handleCloseDialog5 = () => setOpenDialog5(false);

    const [openDialog6, setOpenDialog6] = useState(false);// para adicionar categorias de produtos
    const handleOpenDialog6 = () => setOpenDialog6(true);
    const handleCloseDialog6 = () => setOpenDialog6(false);



    React.useEffect(() => {
        if (user === null) {
            Swal.fire({
                title: "Erro",
                text: "Você não tem permissão para acessar esta página!",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#050505",
            });
            navigate('/');
            return; // Impede que o restante do useEffect seja executado se não estiver logado
        }

        api.get('/api/users').then((response) => {
            setDados(a => ({ ...a, user: { ...a.user, usersSystem: response.data } }));
        }).catch((error) => {
            console.error('Erro ao buscar usuários:', error);
        });
        api.get('/api/images/getAllImages?is_product=1').then((response) => {
            setDados(a => ({ ...a, imagesProducts: response.data.images }));
        }).catch((error) => {
            console.error('Erro ao buscar imagens:', error);
        });
        api.get('/api/categories').then((response) => {
            setDados(a => ({ ...a, categories: response.data.categories }));
        }).catch((error) => {
            console.error('Erro ao buscar categorias:', error);
        });


        setDados(a => ({ ...a, activeTabPerfil: 'dashboard', newUser: { name: '', email: '', password: '', image_id: null, images: [] } }));

        api.get('/api/images/getAllImages').then((response) => {
            setDados(a => ({ ...a, userImages: response.data.images }));
        }).catch((error) => {
            console.error('Erro ao buscar imagens do usuário:', error);
        });
    }, []);


    return (
        <Container component={Box} disableGutters sx={{ mt: 8, p: 4, display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 4, minHeight: '100vh', minWidth: '100%' }}>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, minWidth: '200px' }}>
                <Box sx={{ mb: 0 }}>
                    <Avatar src={user?.url} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                    <Typography align="center">{user?.name}</Typography>
                </Box>

                <List>

                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'dashboard'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'dashboard' }))}
                        >
                            <ListItemIcon><Dashboard /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem> : null}

                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'users'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'users' }))}
                        >
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Usuários" />
                        </ListItem> : null}


                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'products'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'products' }))}
                        >
                            <ListItemIcon><ListIcon /></ListItemIcon>
                            <ListItemText primary="Produtos" />
                        </ListItem> : null}


                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'Categories'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'Categories' }))}
                        >
                            <ListItemIcon><Category /></ListItemIcon>
                            <ListItemText primary="Categorias" />
                        </ListItem> : null}

                    {user?.adm ?
                        <ListItem

                            selected={Dados?.activeTabPerfil === 'addProduct'}
                            onClick={() => {
                                setDados({ ...Dados, activeTabPerfil: 'addProduct', upProduct: true, ProductDataEdit: { name: '', description: '', size: '', price: '', url: '', images: [], image_id: '', categories: [] } });

                            }}
                        >
                            <ListItemIcon>
                                <AddchartIcon />
                            </ListItemIcon>
                            <ListItemText primary="AddProduto" />
                        </ListItem> : null
                    }

                    <ListItem

                        selected={Dados?.activeTabPerfil === 'security'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'security' }))}
                    >
                        <ListItemIcon><Security /></ListItemIcon>
                        <ListItemText primary="Segurança" />
                    </ListItem>

                    {/* wificonfigs */}
                    <ListItem

                        selected={Dados?.activeTabPerfil === 'security'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'WiFiConfigs' }))}
                    >
                        <ListItemIcon>
                            <Wifi />
                        </ListItemIcon>
                        <ListItemText primary="WiFi" />
                    </ListItem>
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

                {/* {Dados?.activeTabPerfil === 'addProduct' && (

                    <AddProduct />


                )} */}

                {Dados?.activeTabPerfil === 'WiFiConfigs' && (
                    <Paper sx={{ p: 3 }}>
                        <FormControl onSubmit={(e) => {
                            e.preventDefault();
                            updateWifiConfig(Dados.wifiConfig);

                        }}>
                            {/* <TextField label="SSID" fullWidth margin="normal" value={Dados?.wifiConfig?.ssid || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, ssid: e.target.value } }))} />
                            <TextField label="Senha" fullWidth margin="normal" type="text" value={Dados?.wifiConfig?.password || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, password: e.target.value } }))} />
                            <TextField label="Tipo de Criptografia" fullWidth margin="normal" value={Dados?.wifiConfig?.encryption || 'WPA'} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, encryption: e.target.value } }))} /> */}
                            <InputLabel id="demo-simple-select-label">Encryption Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Dados?.wifiConfig?.encryption || 'WPA'}
                                label="Encryption Type"
                                onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, encryption: e.target.value } }))}
                            >
                                <MenuItem value="WPA">WPA</MenuItem>
                                <MenuItem value="WPA2">WPA2</MenuItem>
                                <MenuItem value="WPA3">WPA3</MenuItem>
                            </Select>
                            <TextField margin="normal" fullWidth label="SSID" value={Dados?.wifiConfig?.ssid || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, ssid: e.target.value } }))} />
                            <TextField margin="normal" fullWidth label="Senha" value={Dados?.wifiConfig?.password || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, password: e.target.value } }))} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => setDados(a => ({ ...a, wifiConfig: null }))}>Cancelar</Button>
                                <Button variant="contained" type='submit' color="success" startIcon={<Save />}
                                >Salvar</Button>
                            </Box>
                        </FormControl>
                    </Paper>
                )}



            </Box>


            {/* adicionar novo usuário dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Adicionar usuário</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        value={Dados?.newUser?.name}
                        onChange={(e) => setDados(a => ({ ...a, newUser: { ...a.newUser, name: e.target.value } }))}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={Dados?.newUser?.email}
                        onChange={(e) => setDados(a => ({ ...a, newUser: { ...a.newUser, email: e.target.value } }))}
                    />
                    <TextField
                        margin="dense"
                        label="Senha"
                        fullWidth
                        type="password"
                        variant="outlined"
                        value={Dados?.newUser?.password}
                        onChange={(e) => setDados(a => ({ ...a, newUser: { ...a.newUser, password: e.target.value } }))}
                    >

                    </TextField>
                    <TextField
                        margin="dense"
                        label="Telefone"
                        fullWidth
                        type="tel"
                        variant="outlined"
                        value={Dados?.newUser?.others_info?.phone}
                        onChange={(e) => setDados(a => ({ ...a, newUser: { ...a.newUser, others_info: { ...a.newUser.others_info, phone: e.target.value } } }))}
                    >

                    </TextField>

                    <Paper aria-label='Images' sx={{ mt: 2, p: 2, width: '100%', flexDirection: { xs: 'column', md: 'row' }, display: 'flex' }}>


                        <Box sx={{ display: 'flex', }}>
                            <AvatarGroup max={4} sx={{ ml: 2 }}>
                                {Dados?.newUser?.images?.map((img, index) => (
                                    <Avatar sx={{ border: Dados?.newUser?.image_id === img?.id ? '3px solid red !important' : 'none', }} onClick={() => {
                                        setDados(a => ({ ...a, newUser: { ...a.newUser, images: a.newUser.images.filter(i => i.id !== img.id) } }))
                                    }} key={index} src={img.url} />
                                ))}
                            </AvatarGroup>

                        </Box>
                        <Divider sx={{ ml: { xs: 0, md: 2 }, mr: { xs: 2, md: 2 }, mt: { xs: 2, md: 0 } }} orientation={isSmallScreen ? "horizontal" : "vertical"} flexItem />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
                            <IconButton
                                sx={{

                                    mr: 2
                                }}
                                color="success"
                                component="label">
                                <input id='img' hidden accept="image/*" type="file"
                                    onChange={async (ee) => {


                                        const files = ee.target.files;
                                        let uploadedFiles = []


                                        for (let iterator of files) {

                                            uploadedFiles.push(
                                                {
                                                    "file": iterator,
                                                    "id": uniqueId(),//definindo um id unico 
                                                    "name": iterator.name,
                                                    "prod": false,
                                                    "readableSize": iterator.size,
                                                    preview: URL.createObjectURL(iterator), // criando um link para preview da foto carregada
                                                    url: URL.createObjectURL(iterator),// sera usado para setar a variavel img no proprietario/index.js
                                                }
                                            )
                                        }



                                        // CRIANDO UM DATAFORM
                                        const data = new FormData();
                                        data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

                                        // SALVANDO NOVA IMAGEM
                                        // console.log(data)

                                        try {
                                            await api.post(`/api/images/uploadUser`, data, {
                                                onUploadProgress: e => {
                                                    let progr = parseInt(Math.round((e.loaded * 100) / e.total));
                                                    // setProgress(a => a + progr)
                                                }
                                            })
                                            await api.get(`/api/images/getAllImages`).then(r => {
                                                setDados(a => ({ ...a, userImages: r.data.images }))
                                            })


                                        } catch (error) {

                                            alert("formato nao aceito");

                                            Swal.mixin({
                                                toast: true,
                                                position: "top-end",
                                                showConfirmButton: false,
                                                timer: 3000,
                                                timerProgressBar: true,
                                                didOpen: (toast) => {
                                                    toast.onmouseenter = Swal.stopTimer;
                                                    toast.onmouseleave = Swal.resumeTimer;
                                                }
                                            }).fire({
                                                icon: "error",
                                                title: "Formato de arquivo não aceito"
                                            })

                                        }
                                    }}
                                />

                                <PhotoCamera />
                            </IconButton>
                            <Avatar onClick={() => { handleOpenDialog5() }} sx={{ bgcolor: deepOrange[500] }} variant="circular">
                                <Add />
                            </Avatar>
                        </Box>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" startIcon={<Cancel />} color='error' onClick={() => {
                        setDados(a => ({ ...a, newUser: { ...a.newUser, images: [] } }))
                        handleCloseDialog()
                    }}>Cancelar</Button>
                    <Button variant="contained" startIcon={<Save />} color='success' onClick={() => {

                        handleCloseDialog()

                    }} >{Dados?.upUser ? "Editar" : "Adicionar"}</Button>
                </DialogActions>
            </Dialog>

            {/* editando produto dialog2 */}
            <Dialog sx={{ flex: 1 }} open={openDialog2} onClose={handleCloseDialog2}>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', width: "auto" }}
                >
                    {/* <Avatar src={editeProduto?.url} sx={{ width: 100, height: 100, mb: 2 }} /> */}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        value={Dados?.ProductDataEdit?.name}
                        onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, name: e.target.value } }))}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        multiline
                        maxRows={4}
                        value={Dados?.ProductDataEdit?.description}
                        onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, description: e.target.value } }))}
                    />
                    <TextField
                        margin="dense"
                        label="Tamanho/ml"
                        fullWidth
                        // select
                        variant="outlined"
                        value={Dados?.ProductDataEdit?.size}
                        onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, size: e.target.value } }))}
                    />

                    <TextField
                        margin="dense"
                        label="Preço/Unidade"
                        fullWidth
                        // select
                        variant="outlined"
                        value={Dados?.ProductDataEdit?.price}
                        onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, price: e.target.value } }))}
                    >
                        {/* <option value="User">User</option>
            <option value="Admin">Admin</option> */}
                    </TextField>
                    <TextField
                        margin="dense"
                        label="estoque"
                        fullWidth
                        variant="outlined"
                        // multiline
                        // maxRows={4}
                        value={Dados?.ProductDataEdit?.unit}
                        onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, unit: e.target.value } }))}
                    />
                    <Paper sx={{ mt: 2, p: 2, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Imagens
                        </Typography>
                        <CssBaseline />
                        <AvatarGroup>
                            {Dados?.ProductDataEdit?.images?.map((img, index) => (
                                <Avatar
                                    color={img.id === Dados?.ProductDataEdit?.image_id ? "red" : ""}
                                    onClick={() => {

                                        setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, images: a.ProductDataEdit?.images.filter(i => i.id !== img.id) } }))

                                    }}
                                    key={index}
                                    src={img?.url}
                                    sx={{ width: 50, height: 50, border: img.id === Dados?.ProductDataEdit?.image_id ? "2px solid red !important" : undefined }} />
                            ))}
                        </AvatarGroup>

                        <Divider flexItem variant="middle" sx={{ mt: 2, mb: 2 }} />


                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button variant='contained' onClick={handleOpenDialog3}

                                sx={{ mt: 2 }}
                            >
                                Ver Todas
                            </Button>
                            {/* <Avatar onClick={handleOpenDialog3} sx={{ cursor: 'pointer', bgcolor: deepOrange[500] }}>
                                <Add />
                            </Avatar> */}


                            <IconButton
                                variant='contained'
                                component='label'
                            >
                                <input id='img' hidden accept="image/*" type="file"
                                    onChange={async (ee) => {


                                        const files = ee.target.files;
                                        let uploadedFiles = []


                                        for (let iterator of files) {

                                            uploadedFiles.push(
                                                {
                                                    "file": iterator,
                                                    "id": uniqueId(),//definindo um id unico 
                                                    "name": iterator.name,
                                                    "prod": false,
                                                    "readableSize": iterator.size,
                                                    preview: URL.createObjectURL(iterator), // criando um link para preview da foto carregada
                                                    url: URL.createObjectURL(iterator),// sera usado para setar a variavel img no proprietario/index.js
                                                }
                                            )
                                        }



                                        // CRIANDO UM DATAFORM
                                        const data = new FormData();
                                        data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

                                        // SALVANDO NOVA IMAGEM
                                        // console.log(data)

                                        try {
                                            await api.post(`/api/images/uploadProduct`, data, {
                                                onUploadProgress: e => {
                                                    let progr = parseInt(Math.round((e.loaded * 100) / e.total));
                                                    // setProgress(a => a + progr)
                                                }
                                            }).then(r => {

                                                // Swal.mixin({
                                                //     toast: true,
                                                //     position: "top-end",
                                                //     showConfirmButton: false,
                                                //     timer: 3000,
                                                //     timerProgressBar: true,
                                                //     didOpen: (toast) => {
                                                //         toast.onmouseenter = Swal.stopTimer;
                                                //         toast.onmouseleave = Swal.resumeTimer;
                                                //     }
                                                // }).fire({
                                                //     icon: "success",
                                                //     title: "Signed in successfully"
                                                // });



                                            })
                                            await api.get(`/api/images/getAllImages?is_product=1`).then(r => {
                                                setDados(a => ({ ...a, imagesProducts: r.data.images }))
                                            })

                                        } catch (error) {

                                            alert("formato nao aceito");

                                            Swal.mixin({
                                                toast: true,
                                                position: "top-end",
                                                showConfirmButton: false,
                                                timer: 3000,
                                                timerProgressBar: true,
                                                didOpen: (toast) => {
                                                    toast.onmouseenter = Swal.stopTimer;
                                                    toast.onmouseleave = Swal.resumeTimer;
                                                }
                                            }).fire({
                                                icon: "error",
                                                title: "Formato de arquivo não aceito"
                                            })

                                        }
                                    }}
                                />

                                <PhotoCamera sx={{ color: deepOrange[500] }} />
                            </IconButton>
                        </Box>
                    </Paper>
                    <Paper sx={{ mt: 2, p: 2, width: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Categorias
                        </Typography>
                        <Grid container spacing={2}>
                            {Dados?.ProductDataEdit?.categories?.map((category, index) => (
                                <Button variant='contained' color='error' size='small'
                                    onClick={() => { setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, categories: a.ProductDataEdit?.categories.filter(c => c.id !== category.id) } })) }}
                                >


                                    {category.description}

                                </Button>
                            ))}

                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={handleOpenDialog4}
                                variant="contained" size="small"
                                sx={{ mt: 2 }}
                            >
                                Ver Todas
                            </Button>
                            <Button onClick={handleOpenDialog6}
                                variant="contained" size="small"
                                sx={{ mt: 2, ml: 2 }}
                            >
                                Criar
                            </Button>
                        </Box>
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: '10px'
                    }}>
                        <Button variant="contained" startIcon={<Delete />} color='error'
                            onClick={() => {
                                api.delete(`api/products/${Dados?.ProductDataEdit?.id}`).then((response) => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Produto deletado com sucesso!',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    api.get('/api/products').then((response) => {
                                        setDados(a => ({ ...a, products: response.data.produtos }));
                                        handleCloseDialog2();
                                    }).catch((error) => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Erro ao buscar produtos!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        handleCloseDialog2();
                                    });
                                }).catch((error) => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Erro ao deletar produto!',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    handleCloseDialog2();
                                });
                            }}>Deletar
                        </Button>
                        <Button variant="outlined" startIcon={<Cancel />} color='error' onClick={() => {
                            setDados(a => ({ ...a, ProductDataEdit: null }))
                            handleCloseDialog2()
                        }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" startIcon={<Save />} color='success' onClick={async () => {
                            await api.put('/api/products/' + Dados?.ProductDataEdit?.id, Dados?.ProductDataEdit).then((response) => {
                                // atualizar a lista de produtos no frontend
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Produto atualizado com sucesso!',
                                    showConfirmButton: false,
                                    timer: 1500
                                })

                            }).catch((error) => {
                                console.error('Erro ao editar produto:', error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erro ao editar produto!',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                handleCloseDialog2();
                            });
                            await api.get('/api/products').then((response) => {
                                setDados(a => ({ ...a, products: response.data.produtos, ProductDataEdit: null, productsSearch: response.data.produtos }));
                                handleCloseDialog2();
                            }).catch((error) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Erro ao buscar produtos!',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                handleCloseDialog2();
                            });

                        }} >{Dados?.upProduct ? "Atualizar" : "salvar"}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>


            {/* Images de produtos dilog3*/}
            <Dialog open={openDialog3} onClose={handleCloseDialog3}>
                <DialogTitle>Imagens de Produtos</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ImageList sx={{ width: 500, height: 500 }}>

                        {Dados?.imagesProducts?.map((item) => (
                            <ImageListItem key={item.key}>
                                <img
                                    srcSet={`${item.url}?w=150&fit=max&auto=format&dpr=2 2x`}
                                    src={`${item.url}?w=150&fit=max&auto=format`}
                                    alt={item.name}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    // title={item.name}
                                    subtitle={""}
                                    actionPosition="left"
                                    actionIcon={
                                        <IconButton
                                        // sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        // aria-label={`info about ${item.name}`}
                                        >
                                            {
                                                Dados?.ProductDataEdit?.images?.filter(i => i.id === item.id).length > 0 ?
                                                    <DoneAll color={red[500]} />
                                                    :
                                                    <Done onClick={() => {
                                                        setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, image_id: item.id, url: item.url, images: [...(a.ProductDataEdit?.images || []), item] } }))
                                                    }} color={green[500]} />
                                            }
                                            <DeleteForever sx={{ color: red[500], ml: 2 }} onClick={async () => {
                                                setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, images: a.ProductDataEdit?.images.filter(i => i.id !== item.id) } }))
                                                await api.delete(`/api/images?id=${item.id}&key=${item.key}`).then((response) => {
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Imagem deletada com sucesso!',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
                                                }).catch((error) => {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Erro ao deletar imagem!',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
                                                })
                                                await api.get(`/api/images/getAllImages?is_product=1`).then((response) => {
                                                    setDados(a => ({ ...a, imagesProducts: response.data.images }))
                                                }).catch((error) => {
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Erro ao buscar imagens!',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
                                                })
                                            }} />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                    {/* <Grid container spacing={2}>
            {Dados?.imagesProducts?.map((img, index) => (
              <Grid key={index}>
                <Avatar src={img.url} sx={{ width: 80, height: 80 }} />
              </Grid>
            ))}
          </Grid> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog3}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* categorias de produtos dilog4*/}
            <Dialog open={openDialog4} onClose={handleCloseDialog4}>
                <DialogTitle>Categorias de Produto</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={2}>
                        {Dados?.categories?.map((category, index) => (
                            <Button

                                onClick={() => {
                                    setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, categories: [...(a.ProductDataEdit?.categories || []), category] } }))
                                }}

                            >

                                {category.description}

                            </Button>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog4}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* dialog de add imagem em newUser  dialog5*/}
            <Dialog open={openDialog5} onClose={handleCloseDialog5}>
                <DialogTitle>Escolha uma imagem para o usuário</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>

                    <ImageList sx={{ width: 500, height: 500 }}>

                        {Dados?.userImages?.map((item) => (
                            <ImageListItem key={item.key}>
                                <img
                                    srcSet={`${item.url}?w=150&fit=max&auto=format&dpr=2 2x`}
                                    src={`${item.url}?w=150&fit=max&auto=format`}
                                    alt={item.name}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={item.name}
                                    sx={{
                                        "& .MuiImageListItemBar-title": {
                                            fontSize: "0.6rem",
                                        },
                                    }}
                                    actionPosition="left"
                                    subtitle={""}
                                    actionIcon={
                                        <IconButton

                                        // sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        // aria-label={`info about ${item.name}`}
                                        >
                                            {
                                                Dados?.newUser?.images?.filter(i => i.id === item.id).length > 0 ?
                                                    <DoneAll color={red[500]} />
                                                    :
                                                    <Done onClick={() => {
                                                        setDados(a => ({ ...a, newUser: { ...a.newUser, image_id: item.id, url: item.url, images: [...(a.newUser?.images || []), item] } }))
                                                    }} color={green[500]} />
                                            }
                                            <DeleteForever onClick={async () => {
                                                await api.delete(`/api/images?id=${item.id}&key=${item.key}`).then(res => {
                                                    console.log(res)
                                                    setDados(a => ({ ...a, newUser: { ...a.newUser, images: a.newUser?.images?.filter(i => i.id !== item.id) } }))
                                                }).catch(err => {
                                                    console.log(err)
                                                })
                                                await api.get(`/api/images/getAllImages`).then(res => {
                                                    console.log("pegou", res.data.images)
                                                    setDados(a => ({ ...a, userImages: res.data.images }))
                                                }).catch(err => {
                                                    console.log(err)
                                                })
                                            }} sx={{ ml: 1, color: 'red' }} />
                                        </IconButton>

                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog5}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* criando nova categoria dialog 6 */}
            <Dialog open={openDialog6} onClose={handleCloseDialog6}>
                <DialogTitle>Criar Categoria</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', pb: 2 }}>

                    <TextField label="Descrição" value={Dados?.newCategory?.description} onChange={(e) => setDados(a => ({ ...a, newCategory: { ...a.newCategory, description: e.target.value } }))} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        await api.post(`/api/categories`, { description: Dados?.newCategory?.description }).then(res => {


                        }).catch(err => {
                            console.log(err)
                        })
                        await api.get(`/api/categories`).then(res => {
                            console.log("pegou", res.data.categories)
                            setDados(a => ({ ...a, categories: res.data.categories }))
                        }).catch(err => {
                            console.log(err)
                        })
                        handleCloseDialog6()
                    }}>Salvar</Button>
                </DialogActions>
            </Dialog>




        </Container >
    );
}
