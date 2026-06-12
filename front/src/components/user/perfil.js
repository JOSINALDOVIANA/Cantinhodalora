import React, { useState } from 'react';
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

} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import { DadosContext } from '../../routs.js';
import { api } from '../../api/index.js';
import ProductCard from '../card/index.js';

import AddchartIcon from '@mui/icons-material/Addchart';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import useMediaQuery from "@mui/material/useMediaQuery";



export default function AdminPanel() {


    const theme = useTheme();

    const [Dados, setDados] = React.useContext(DadosContext);

    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [showPassword, setShowPassword] = React.useState(false);
    const outlinedPasswordId = React.useId();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const totalUsers = Dados?.user?.usersSystem?.length || 0;
    const activeUsers = Dados?.user?.usersSystem?.filter(u => u.status == true).length || 0;
    const adminUsers = Dados?.user?.usersSystem?.filter(u => u.adm == true).length || 0;
    const totalProducts = Dados?.products?.length || 0;

    const getPercent = (value, total) => total > 0 ? Math.round((value / total) * 100) : 0;

    const dashboardCards = [
        {
            title: 'Usuários',
            value: totalUsers,
            subtitle: 'Total de usuários cadastrados',
            percent: getPercent(totalUsers, totalUsers), // Sempre 100% para o total
            color: green[500],
        },
        {
            title: 'Ativos',
            value: activeUsers,
            subtitle: 'Usuários com status ativo',
            percent: getPercent(activeUsers, totalUsers),
            color: blue[500],
        },
        {
            title: 'Administradores',
            value: adminUsers,
            subtitle: 'Contagem de administradores',
            percent: getPercent(adminUsers, totalUsers),
            color: purple[500],
        },
        {
            title: 'Produtos',
            value: totalProducts,
            subtitle: 'Produtos cadastrados no catálogo',
            percent: totalProducts > 0 ? 100 : 0,
            color: deepOrange[500],
        },
    ];

    const renderDashboardCard = ({ title, value, subtitle, percent, color }) => (
        <Grid xs={12} sm={6} md={4} key={title}>
            <Card sx={{
                minHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.grey[50],
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[1],
            }}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    height: '100%',
                    width: '100%',
                }}>
                    <Typography color="textSecondary" gutterBottom sx={{ letterSpacing: 0.5 }}>
                        {title}
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            variant="determinate"
                            value={percent}
                            size={120}
                            thickness={5}
                            sx={{ color, opacity: 0.2 }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={percent}
                            size={120}
                            thickness={5}
                            sx={{
                                color,
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                transform: 'rotate(-90deg)',
                            }}
                        />
                        <Box sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {value}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {percent}%
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" textAlign="center">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

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
        if (!Dados?.logado) {
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
                    <Avatar src={Dados?.user?.url} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                    <Typography align="center">{Dados?.user?.name}</Typography>
                </Box>

                <List>

                    {Dados?.user?.adm ?
                        <ListItem
                            button
                            selected={Dados?.activeTabPerfil === 'dashboard'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'dashboard' }))}
                        >
                            <ListItemIcon><Dashboard sx={{ color:theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem> : null}

                    {Dados?.user?.adm ?
                        <ListItem
                            button
                            selected={Dados?.activeTabPerfil === 'users'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'users' }))}
                        >
                            <ListItemIcon><People sx={{ color:theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText primary="Usuários" />
                        </ListItem> : null}

                    <ListItem
                        button
                        selected={Dados?.activeTabPerfil === 'settings'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'settings' }))}
                    >
                        <ListItemIcon><Settings sx={{ color:theme.palette.primary.main }} /></ListItemIcon>
                        <ListItemText primary="Meus Dados" />
                    </ListItem>

                    {Dados?.user?.adm ?
                        <ListItem
                            button
                            selected={Dados?.activeTabPerfil === 'products'}
                            onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'products' }))}
                        >
                            <ListItemIcon><ListIcon sx={{ color:theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText primary="Produtos" />
                        </ListItem> : null}

                    {Dados?.user?.adm ?
                        <ListItem
                            button
                            selected={Dados?.activeTabPerfil === 'addProduct'}
                            onClick={() => {
                                setDados({ ...Dados, activeTabPerfil: 'addProduct', upProduct: true, ProductDataEdit: { name: '', description: '', size: '', price: '', url: '', images: [], image_id: '', categories: [] } });

                            }}
                        >
                            <ListItemIcon>
                                <AddchartIcon sx={{ color:theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText primary="AddProduto" />
                        </ListItem> : null
                    }

                    <ListItem
                        button
                        selected={Dados?.activeTabPerfil === 'security'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'security' }))}
                    >
                        <ListItemIcon><Security sx={{ color:theme.palette.primary.main }} /></ListItemIcon>
                        <ListItemText primary="Segurança" />
                    </ListItem>

                    {/* wificonfigs */}
                    <ListItem
                        button
                        selected={Dados?.activeTabPerfil === 'security'}
                        onClick={() => setDados(a => ({ ...a, activeTabPerfil: 'WiFiConfigs' }))}
                    >
                        <ListItemIcon>
                            <Wifi sx={{ color:theme.palette.primary.main }} />
                        </ListItemIcon>
                        <ListItemText primary="WiFi" />
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ flexGrow: 1 }}>

                {Dados?.activeTabPerfil === 'dashboard' && (
                    <Grid container spacing={2} sx={{ alignItems: 'stretch', justifyContent: 'center' }}>
                        {dashboardCards.map((card) => renderDashboardCard(card))}
                    </Grid>
                )}

                {Dados?.activeTabPerfil === 'users' && (
                    <Paper sx={{ display: 'flex', flexDirection: 'column', flexFlow: 1, flex: 1 }} >
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Gerenciar Usuários</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => {
                                    setDados({ ...Dados, upUser: false, newUser: { name: '', email: '', password: '', images: [], adm: false, others_info: {} } })
                                    handleOpenDialog()
                                }}>
                                Novo Usuário
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{}}>
                                        <TableCell>Imagem</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Senha</TableCell>
                                        <TableCell align="center">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Dados?.user?.usersSystem?.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell >{<Avatar src={user.url || user?.iamges?.[0]?.url} sx={{ width: 80, height: 80 }} />}</TableCell>
                                            <TableCell >{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                                    <InputLabel htmlFor={`${outlinedPasswordId}-input`} />
                                                    <OutlinedInput
                                                        value={user?.password}
                                                        id={`${outlinedPasswordId}-input`}
                                                        type={showPassword ? 'text' : 'password'}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label={
                                                                        showPassword ? 'hide the password' : 'display the password'
                                                                    }
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    onMouseUp={handleMouseUpPassword}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label="Password"
                                                    />
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button onClick={() => {
                                                    setDados(a => ({ ...a, upUser: true, newUser: { ...user } }))
                                                    handleOpenDialog()
                                                }} size="small" startIcon={<Edit />} sx={{ mr: 1 }}>
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => {
                                                        api.delete(`api/users/${user.id}`).then(r => {
                                                            api.get('/api/users').then(r => {
                                                                setDados(a => ({ ...a, user: { ...a.user, usersSystem: [...r.data] } }))
                                                            })
                                                        })
                                                    }}
                                                >
                                                    Deletar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {Dados?.activeTabPerfil === 'settings' && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Configurações do Sistema</Typography>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Nome da Aplicação" fullWidth defaultValue="Naldo" />
                            <TextField label="Email de Contato" fullWidth defaultValue="contato@naldo.com" />
                            <TextField label="Telefone" fullWidth defaultValue="+55 (11) 98765-4321" />
                            <Button variant="contained">Salvar Configurações</Button>
                        </Box>
                    </Paper>
                )}

                {Dados?.activeTabPerfil === 'products' && (

                    <Grid sx={{ justifyContent: 'center' }} container spacing={1}>
                        {
                            Dados?.productsSearch?.map((produto, index) => (
                                <Grid
                                    xs={6}
                                    md={4}
                                    lg={3}
                                    key={index}>
                                    <ProductCard onClick={() => { setDados(a => ({ ...a, ProductDataEdit: produto })); handleOpenDialog2(); }} produto={produto} />
                                </Grid>
                            ))
                        }
                    </Grid>
                )}

                {Dados?.activeTabPerfil === 'addProduct' && (

                    <Paper elevation={5} sx={{ p: 3, minWidth: '50%', minHeight: '100vh' }}>

                        <Box
                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', gap: 2, mb: 2 }}
                        >
                            <Avatar src={Dados?.ProductDataEdit?.url} sx={{ width: 100, height: 100, mb: 2 }} />
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
                                label="estoque"
                                fullWidth
                                variant="outlined"
                                // multiline
                                // maxRows={4}
                                value={Dados?.ProductDataEdit?.unit}
                                onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, unit: e.target.value } }))}
                            />
                            <TextField
                                margin="dense"
                                label="Preço/UNIDADE"
                                fullWidth
                                variant="outlined"
                                // multiline
                                // maxRows={4}
                                value={Dados?.ProductDataEdit?.price}
                                onChange={(e) => setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, price: e.target.value } }))}
                            />

                            <Paper sx={{ mt: 2, p: 2, width: '100%' }}>
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
                                <Divider flexItem variant="middle" sx={{ mt: 2 }} />
                                <Box sx={{ gap: 2, display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button variant='contained' onClick={handleOpenDialog3}

                                        sx={{ mt: 2 }}
                                    >
                                        Selecionar
                                    </Button>


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
                                                    await api.post(`/api/images/uploadProduct`, data, {
                                                        onUploadProgress: e => {
                                                            let progr = parseInt(Math.round((e.loaded * 100) / e.total));
                                                            // setProgress(a => a + progr)
                                                        }
                                                    }).then(r => {

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
                                                            icon: "success",
                                                            title: "Signed in successfully"
                                                        });



                                                    })
                                                    await api.get(`/api/images/getAllImages?is_product=true`).then(r => {
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

                                        <PhotoCamera />
                                    </IconButton>

                                </Box>

                            </Paper>
                            <Paper sx={{ mt: 2, p: 2, width: '100%' }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Categorias
                                </Typography>
                                <Grid container spacing={2}>
                                    {Dados?.ProductDataEdit?.categories?.map((category, index) => (
                                        <Button
                                            onClick={() => { setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, categories: a.ProductDataEdit?.categories.filter(c => c.id !== category.id) } })) }}
                                        >


                                            {category.description}

                                        </Button>
                                    ))}

                                </Grid>
                                <Divider flexItem variant="middle" sx={{ mt: 2, mb: 2 }} />
                                <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>

                                    <Button variant='contained' onClick={handleOpenDialog4}
                                    >
                                        Selecionar
                                    </Button>
                                    <Button onClick={() => { handleOpenDialog6() }} color='warning' variant='contained'>Adicionar</Button>
                                </Box>
                            </Paper>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: "space-between", mt: 2, gap: 2 }}>
                            <Button color='error' startIcon={<Cancel />} variant="outlined" onClick={() => {
                                setDados(a => ({ ...a, ProductDataEdit: null, activeTabPerfil: 'products' }))


                            }}>Cancelar</Button>
                            <Button color='success' startIcon={<Save />} variant="contained" onClick={async () => {
                                await api.post('/api/products', Dados?.ProductDataEdit).then((response) => {
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
                                    setDados(a => ({ ...a, products: response.data.produtos, ProductDataEdit: null, activeTabPerfil: 'products', productsSearch: response.data.produtos }));


                                }).catch((error) => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Erro ao buscar produtos!',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })

                                });

                            }} >Salvar</Button>
                        </Box>
                    </Paper>


                )}

                {Dados?.activeTabPerfil === 'WiFiConfigs' && (
                    <Paper sx={{ p: 3 }}>
                        <TextField label="SSID" fullWidth margin="normal" value={Dados?.wifiConfig?.ssid || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, ssid: e.target.value } }))} />
                        <TextField label="Senha" fullWidth margin="normal" type="text" value={Dados?.wifiConfig?.password || ''} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, password: e.target.value } }))} />
                        <TextField label="Tipo de Criptografia" fullWidth margin="normal" value={Dados?.wifiConfig?.encryption || 'WPA'} onChange={(e) => setDados(a => ({ ...a, wifiConfig: { ...a.wifiConfig, encryption: e.target.value } }))} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => setDados(a => ({ ...a, wifiConfig: null }))}>Cancelar</Button>
                            <Button variant="contained" color="success" startIcon={<Save />} onClick={() => {
                                if (Dados?.wifiConfig?.id) {
                                    api.put(`/api/wifi/${Dados.wifiConfig.id}`, Dados.wifiConfig).then(r => {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Configuração de WiFi atualizada com sucesso!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });

                                    }).catch((error) => {
                                        console.error('Erro ao atualizar configuração de WiFi:', error);
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Erro ao atualizar configuração de WiFi!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });

                                    });
                                } else {
                                    api.post('/api/wifi', Dados.wifiConfig).then(r => {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Configuração de WiFi criada com sucesso!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });

                                    }).catch((error) => {
                                        console.error('Erro ao criar configuração de WiFi:', error);
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Erro ao criar configuração de WiFi!',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });

                                    });
                                }
                            }
                            }
                            >Salvar</Button>
                        </Box>
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
                        if (Dados?.upUser) {
                            api.put(`api/users/${Dados?.newUser?.id}`, { ...Dados?.newUser }).then(r => {
                                api.get('/api/users').then(r => {
                                    setDados(a => ({ ...a, upUser: false, user: { ...a.user, usersSystem: [...r.data] } }))
                                })
                            })
                        } else {
                            api.post(`api/users`, { ...Dados?.newUser }).then(r => {
                                api.get('/api/users').then(r => {
                                    setDados(a => ({ ...a, user: { ...a.user, usersSystem: [...r.data] } }))
                                })
                            })
                        }
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
