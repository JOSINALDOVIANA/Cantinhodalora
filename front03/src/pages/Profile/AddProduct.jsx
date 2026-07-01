import React, { useContext } from 'react';
import { Paper, Avatar, TextField, Box, Divider, IconButton, AvatarGroup, CssBaseline, Button, ImageList, ImageListItem, ImageListItemBar, Typography, useMediaQuery, useTheme, Grid, FormControl } from '@mui/material';

import { useLocation } from 'react-router-dom';
import { DadosContext } from '../../services/Contexts/DadosContext';
import { useRefreshUser } from '../../services/UseQuery/UsersQuery';
import { PhotoCamera, AddBox, Cancel, Save } from '@mui/icons-material';


// import { Container } from './styles';

export default function AddProduct() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const { user } = useRefreshUser();
    const { Dados, setDados } = useContext(DadosContext);
    const location = useLocation();

    // console.log(Dados?.ProductDataEdit);

    return (
        <>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', gap: 2 }}
            >
                <FormControl onSubmit={(e) => {
                    e.preventDefault();

                }} component={Paper} sx={{ p: 2, minWidth: '50%', minHeight: '50vh' }}>



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

                        <Paper elevation={3} sx={{ mt: 2, p: 2, width: '100%' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Imagens
                            </Typography>
                            {/* <CssBaseline /> */}
                            <AvatarGroup>
                                {Dados?.ProductDataEdit?.images?.map((img, index) => (
                                    <Avatar
                                        // color={img.id === Dados?.ProductDataEdit?.image_id ? "red" : ""}
                                        onClick={() => {

                                            setDados(a => ({ ...a, ProductDataEdit: { ...a.ProductDataEdit, images: a.ProductDataEdit?.images.filter(i => i.id !== img.id) } }))

                                        }}
                                        key={index}
                                        src={img?.url}
                                        sx={{ width: 50, height: 50, border: img.id === Dados?.ProductDataEdit?.image_id ? "2px solid red !important" : undefined }} />
                                ))}
                            </AvatarGroup>
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
                                <Button variant='contained' onClick={() => { }}

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

                                <Button variant='contained' onClick={() => { }}
                                >
                                    Selecionar
                                </Button>
                                <Button onClick={() => { }} color='warning' variant='contained'>Adicionar</Button>
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
                    {/* </Paper> */}
                </FormControl>

            </Box>

        </>
    );
}
