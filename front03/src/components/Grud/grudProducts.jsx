import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    List,
    ListItem,
    IconButton,
    CircularProgress,
    Alert,
    Tooltip,
    Zoom,
    Avatar,
    Chip,
    AvatarGroup,
    Divider,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    Inventory as InventoryIcon,
    PhotoCamera,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
    useLoadProducts,
    useAddProduct,
    useUpdateProduct,
    useDeleteProduct,
    useRefreshProducts,
} from "../../services/UseQuery/ProductsQuery.jsx"; // ajuste o caminho conforme sua estrutura
import { api } from "../../services/api.jsx";
import { useLoadImagesProducts } from "../../services/UseQuery/ImagesQuery.jsx";
import { useLoadCategories } from "../../services/UseQuery/CategoriesQuery.jsx";
import { uniqueId } from "lodash";

export default function ProductsManager() {
    const { imagesProducts, loadingImagesProducts, refreshImages } = useLoadImagesProducts();
    const { categories, loadingCategories, refreshCategories } = useLoadCategories();
    const { products, loadingProducts, refreshProducts, error } = useLoadProducts();

    const addMutation = useAddProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        size: "",
        price: "",
        unit: "",
        url: "",
        images: [],
        categories: [],
    });

    const [editProduct, setEditProduct] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newProduct.name.trim()) return;
        addMutation.mutate(newProduct);
        setNewProduct({
            name: "",
            description: "",
            size: "",
            price: "",
            unit: "",
            url: "",
            images: [],
            categories: [],
            image_id: ""
        });
    };

    const handleSaveEdit = () => {
        // console.log(editProduct);
        if (!editProduct?.name?.trim()) return;
        updateMutation.mutate(editProduct);
        setEditProduct(null);
    };

    const handleDelete = (prod) => {
        Swal.fire({
            title: "Tem certeza?",
            text: `Você deseja excluir o produto "${prod.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate({ id: prod.id });
                Swal.fire({
                    title: "Deletado!",
                    text: "O produto foi removido com sucesso.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    const handleToggleImage = (img) => {
        if (editProduct) {
            const exists = editProduct.images?.some(item => item.id === img.id);
            if (exists) {
                setEditProduct(prev => ({
                    ...prev,
                    image_id: prev.image_id == img.id ? "" : prev.image_id,
                    images: prev.images.filter(item => item.id !== img.id)
                }));
            } else {
                setEditProduct(prev => ({
                    ...prev,
                    images: [...(prev.images || []), img],
                    image_id: img.id
                }));

            }
        } else {
            const exists = newProduct.images?.some(item => item.id === img.id);
            if (exists) {
                setNewProduct(prev => ({
                    ...prev,
                    image_id: prev.image_id == img.id ? "" : prev.image_id,
                    images: prev.images.filter(item => item.id !== img.id)
                }));
            } else {
                setNewProduct(prev => ({
                    ...prev,
                    images: [...(prev.images || []), img],
                    image_id: img.id
                }));

            }
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 4,
                borderRadius: 4,
                maxWidth: 800,
                mx: "auto",
                mt: 2,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                background: (theme) => theme.palette.background.paper,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.5px",
                    }}
                >
                    Gerenciar Produtos
                </Typography>
                <Tooltip title="Atualizar Lista" arrow TransitionComponent={Zoom}>
                    <IconButton
                        onClick={() => refreshProducts()}
                        color="primary"
                        sx={{
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
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Formulário de adicionar */}
            <Box
                component="form"
                onSubmit={handleAdd}
                sx={{
                    mb: 5,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Novo Produto
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nome do Produto"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Descrição"
                            multiline
                            rows={2}
                            value={newProduct.description}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, description: e.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Tamanho / Vol"
                            value={newProduct.size}
                            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                            placeholder="Ex: 500ml, 1kg, Unitário"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Preço (R$)"
                            type="number"
                            inputProps={{ step: "0.01" }}
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Estoque / Unidades"
                            type="number"
                            value={newProduct.unit}
                            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <TextField
                            fullWidth
                            size="small"
                            label="URL da Imagem"
                            value={newProduct.url}
                            onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                        /> */}
                        <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography>Imagens: </Typography>
                            <Box sx={{ display: 'flex', flexDirection: "row", overflowX: 'auto', maxWidth: '100%', py: 1, scrollbarWidth: 'thin' }}>
                                <AvatarGroup sx={{ flexDirection: "row" }}>
                                    {newProduct?.images?.map((img, index) => (
                                        <Avatar
                                            // color={img.id === Dados?.ProductDataEdit?.image_id ? "red" : ""}
                                            onClick={() => {

                                                setNewProduct(a => ({ ...a, images: a.images?.filter(i => i.id !== img.id) }))

                                            }}

                                            key={index}
                                            src={img?.url}
                                            sx={{ width: 50, height: 50, border: img.id === newProduct?.image_id ? "2px solid red !important" : undefined, flexShrink: 0 }}
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
                                <Button variant='contained' onClick={() => setOpenImageModal(true)}

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

                                            // try {
                                            //     await api.post(`/api/images/uploadProduct`, data, {
                                            //         onUploadProgress: e => {
                                            //             let progr = parseInt(Math.round((e.loaded * 100) / e.total));
                                            //             // setProgress(a => a + progr)
                                            //         }
                                            //     }).then(r => {

                                            //         Swal.mixin({
                                            //             toast: true,
                                            //             position: "top-end",
                                            //             showConfirmButton: false,
                                            //             timer: 3000,
                                            //             timerProgressBar: true,
                                            //             didOpen: (toast) => {
                                            //                 toast.onmouseenter = Swal.stopTimer;
                                            //                 toast.onmouseleave = Swal.resumeTimer;
                                            //             }
                                            //         }).fire({
                                            //             icon: "success",
                                            //             title: "Signed in successfully"
                                            //         });



                                            //     })
                                            //     await api.get(`/api/images/getAllImages?is_product=true`).then(r => {
                                            //         setDados(a => ({ ...a, imagesProducts: r.data.images }))
                                            //     })

                                            // } catch (error) {

                                            //     alert("formato nao aceito");

                                            //     Swal.mixin({
                                            //         toast: true,
                                            //         position: "top-end",
                                            //         showConfirmButton: false,
                                            //         timer: 3000,
                                            //         timerProgressBar: true,
                                            //         didOpen: (toast) => {
                                            //             toast.onmouseenter = Swal.stopTimer;
                                            //             toast.onmouseleave = Swal.resumeTimer;
                                            //         }
                                            //     }).fire({
                                            //         icon: "error",
                                            //         title: "Formato de arquivo não aceito"
                                            //     })

                                            // }

                                            try {
                                                const response = await api.post(`/api/images/uploadProduct`, data, {
                                                    onUploadProgress: e => {
                                                        const progress = Math.round((e.loaded * 100) / e.total);
                                                        // setProgress(progress); // se quiser mostrar progresso
                                                    }
                                                });

                                                // Toast de sucesso
                                                Swal.mixin({
                                                    toast: true,
                                                    position: "top-end",
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                    timerProgressBar: true,
                                                    didOpen: toast => {
                                                        toast.onmouseenter = Swal.stopTimer;
                                                        toast.onmouseleave = Swal.resumeTimer;
                                                    }
                                                }).fire({
                                                    icon: "success",
                                                    title: "Upload realizado com sucesso!"
                                                });

                                                // Buscar imagens atualizadas
                                                refreshImages();
                                            } catch (error) {
                                                console.error(error);

                                                Swal.mixin({
                                                    toast: true,
                                                    position: "top-end",
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                    timerProgressBar: true,
                                                    didOpen: toast => {
                                                        toast.onmouseenter = Swal.stopTimer;
                                                        toast.onmouseleave = Swal.resumeTimer;
                                                    }
                                                }).fire({
                                                    icon: "error",
                                                    title: "Formato de arquivo não aceito"
                                                });
                                            }

                                        }}
                                    />

                                    <PhotoCamera />
                                </IconButton>

                            </Box>
                        </Box>

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                        >
                            <Typography>Categorias: </Typography>
                            {categories?.map((cat, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={newProduct.categories.includes(cat.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewProduct({
                                                        ...newProduct,
                                                        categories: [...newProduct.categories, cat.id],
                                                    });
                                                } else {
                                                    setNewProduct({
                                                        ...newProduct,
                                                        categories: newProduct.categories.filter(
                                                            (id) => id !== cat.id
                                                        ),
                                                    });
                                                }
                                            }}
                                            color="primary"
                                        />
                                    }
                                    label={cat.description}
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                textTransform: "none",
                                fontWeight: 600,
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.2)",
                                },
                            }}
                        >
                            Adicionar Produto
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Conteúdo principal / Lista */}
            {loadingProducts ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                        gap: 2,
                    }}
                >
                    <CircularProgress size={40} thickness={4} />
                    <Typography variant="body2" color="text.secondary">
                        Carregando produtos...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Erro ao carregar produtos. Por favor, tente novamente mais tarde.
                </Alert>
            ) : (
                <List sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0 }}>
                    {products?.length === 0 ? (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 6, fontStyle: "italic" }}
                        >
                            Nenhum produto cadastrado. Crie um acima!
                        </Typography>
                    ) : (
                        products?.map((prod) => (
                            <ListItem
                                key={prod.id}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    bgcolor: "background.paper",
                                    transition: "all 0.25s ease-in-out",
                                    "&:hover": {
                                        borderColor: "primary.light",
                                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.03)",
                                        transform: "translateY(-2px)",
                                    },
                                    p: 2.5,
                                }}
                            >
                                {editProduct?.id === prod.id ? (
                                    <Box sx={{ width: "100%" }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                            Editar Produto
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Nome"
                                                    value={editProduct.name}
                                                    onChange={(e) =>
                                                        setEditProduct({ ...editProduct, name: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {/* <TextField
                            fullWidth
                            size="small"
                            label="URL da Imagem"
                            value={newProduct.url}
                            onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                        /> */}
                                                <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography>Imagens: </Typography>
                                                    <Box sx={{ display: 'flex', flexDirection: "row", overflowX: 'auto', maxWidth: '100%', py: 1, scrollbarWidth: 'thin' }}>
                                                        <AvatarGroup sx={{ flexDirection: "row" }}>
                                                            {editProduct?.images?.map((img, index) => (
                                                                <Avatar
                                                                    // color={img.id === Dados?.ProductDataEdit?.image_id ? "red" : ""}
                                                                    onClick={() => {

                                                                        setEditProduct(a => ({ ...a, images: a.images?.filter(i => i.id !== img.id) }))

                                                                    }}

                                                                    key={index}
                                                                    src={img?.url}
                                                                    sx={{ width: 50, height: 50, border: img.id === editProduct?.image_id ? "2px solid red !important" : undefined, flexShrink: 0 }}
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
                                                        <Button variant='contained' onClick={() => setOpenImageModal(true)}

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

                                                                    // try {
                                                                    //     await api.post(`/api/images/uploadProduct`, data, {
                                                                    //         onUploadProgress: e => {
                                                                    //             let progr = parseInt(Math.round((e.loaded * 100) / e.total));
                                                                    //             // setProgress(a => a + progr)
                                                                    //         }
                                                                    //     }).then(r => {

                                                                    //         Swal.mixin({
                                                                    //             toast: true,
                                                                    //             position: "top-end",
                                                                    //             showConfirmButton: false,
                                                                    //             timer: 3000,
                                                                    //             timerProgressBar: true,
                                                                    //             didOpen: (toast) => {
                                                                    //                 toast.onmouseenter = Swal.stopTimer;
                                                                    //                 toast.onmouseleave = Swal.resumeTimer;
                                                                    //             }
                                                                    //         }).fire({
                                                                    //             icon: "success",
                                                                    //             title: "Signed in successfully"
                                                                    //         });



                                                                    //     })
                                                                    //     await api.get(`/api/images/getAllImages?is_product=true`).then(r => {
                                                                    //         setDados(a => ({ ...a, imagesProducts: r.data.images }))
                                                                    //     })

                                                                    // } catch (error) {

                                                                    //     alert("formato nao aceito");

                                                                    //     Swal.mixin({
                                                                    //         toast: true,
                                                                    //         position: "top-end",
                                                                    //         showConfirmButton: false,
                                                                    //         timer: 3000,
                                                                    //         timerProgressBar: true,
                                                                    //         didOpen: (toast) => {
                                                                    //             toast.onmouseenter = Swal.stopTimer;
                                                                    //             toast.onmouseleave = Swal.resumeTimer;
                                                                    //         }
                                                                    //     }).fire({
                                                                    //         icon: "error",
                                                                    //         title: "Formato de arquivo não aceito"
                                                                    //     })

                                                                    // }

                                                                    try {
                                                                        const response = await api.post(`/api/images/uploadProduct`, data, {
                                                                            onUploadProgress: e => {
                                                                                const progress = Math.round((e.loaded * 100) / e.total);
                                                                                // setProgress(progress); // se quiser mostrar progresso
                                                                            }
                                                                        });

                                                                        // Toast de sucesso
                                                                        Swal.mixin({
                                                                            toast: true,
                                                                            position: "top-end",
                                                                            showConfirmButton: false,
                                                                            timer: 3000,
                                                                            timerProgressBar: true,
                                                                            didOpen: toast => {
                                                                                toast.onmouseenter = Swal.stopTimer;
                                                                                toast.onmouseleave = Swal.resumeTimer;
                                                                            }
                                                                        }).fire({
                                                                            icon: "success",
                                                                            title: "Upload realizado com sucesso!"
                                                                        });

                                                                        // Buscar imagens atualizadas
                                                                        refreshImages();
                                                                    } catch (error) {
                                                                        console.error(error);

                                                                        Swal.mixin({
                                                                            toast: true,
                                                                            position: "top-end",
                                                                            showConfirmButton: false,
                                                                            timer: 3000,
                                                                            timerProgressBar: true,
                                                                            didOpen: toast => {
                                                                                toast.onmouseenter = Swal.stopTimer;
                                                                                toast.onmouseleave = Swal.resumeTimer;
                                                                            }
                                                                        }).fire({
                                                                            icon: "error",
                                                                            title: "Formato de arquivo não aceito"
                                                                        });
                                                                    }

                                                                }}
                                                            />

                                                            <PhotoCamera />
                                                        </IconButton>

                                                    </Box>
                                                </Box>

                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Descrição"
                                                    multiline
                                                    rows={2}
                                                    value={editProduct.description}
                                                    onChange={(e) =>
                                                        setEditProduct({
                                                            ...editProduct,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Tamanho"
                                                    value={editProduct.size}
                                                    onChange={(e) =>
                                                        setEditProduct({ ...editProduct, size: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Preço"
                                                    type="number"
                                                    inputProps={{ step: "0.01" }}
                                                    value={editProduct.price}
                                                    onChange={(e) =>
                                                        setEditProduct({ ...editProduct, price: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Estoque"
                                                    type="number"
                                                    value={editProduct.unit}
                                                    onChange={(e) =>
                                                        setEditProduct({ ...editProduct, unit: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box
                                                    sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                                                >
                                                    <Typography>Categorias: </Typography>
                                                    {categories?.map((cat, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={editProduct?.categories?.includes(cat.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setEditProduct({
                                                                                ...editProduct,
                                                                                categories: [...editProduct.categories, cat.id],
                                                                            });
                                                                        } else {
                                                                            setEditProduct({
                                                                                ...editProduct,
                                                                                categories: editProduct.categories.filter(
                                                                                    (id) => id !== cat.id
                                                                                ),
                                                                            });
                                                                        }
                                                                    }}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={cat.description}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<SaveIcon />}
                                                    onClick={handleSaveEdit}
                                                    sx={{ textTransform: "none", borderRadius: 2 }}
                                                >
                                                    Salvar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="inherit"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => setEditProduct(null)}
                                                    sx={{ textTransform: "none", borderRadius: 2 }}
                                                >
                                                    Cancelar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: { xs: "flex-start", sm: "center" },
                                            flexDirection: { xs: "column", sm: "row" },
                                            gap: 2.5,
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={prod.urlFull}
                                            alt={prod.name}
                                            sx={{
                                                width: 75,
                                                height: 75,
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                                                border: "1px solid",
                                                borderColor: "divider",
                                            }}
                                        >
                                            <InventoryIcon fontSize="large" color="action" />
                                        </Avatar>

                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                                                    {prod.name}
                                                </Typography>
                                                {prod.size && (
                                                    <Chip
                                                        label={prod.size}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500, height: 20 }}
                                                    />
                                                )}
                                                <Chip
                                                    label={`R$ ${parseFloat(prod.price || 0).toFixed(2)}`}
                                                    size="small"
                                                    color="primary"
                                                    variant="soft"
                                                    sx={{
                                                        fontWeight: 600,
                                                        height: 20,
                                                        backgroundColor: (theme) =>
                                                            theme.palette.mode === "dark" ? "rgba(25,118,210,0.2)" : "rgba(25,118,210,0.1)",
                                                        color: "primary.main",
                                                    }}
                                                />
                                                <Chip
                                                    label={`Estoque: ${prod.unit || 0}`}
                                                    size="small"
                                                    variant="outlined"
                                                    color={prod.unit > 0 ? "success" : "error"}
                                                    sx={{ fontWeight: 500, height: 20 }}
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                                {prod.description || "Sem descrição disponível."}
                                            </Typography>

                                            {prod.categories && prod.categories.length > 0 && (
                                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                        Categorias:
                                                    </Typography>
                                                    {prod.categories.map((c) => (
                                                        <Chip
                                                            key={c.id || c.description}
                                                            label={c.description}
                                                            size="small"
                                                            sx={{
                                                                height: 18,
                                                                fontSize: "0.75rem",
                                                                backgroundColor: "action.selected",
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ display: "flex", gap: 1, alignSelf: { xs: "flex-end", sm: "center" } }}>
                                            <Tooltip title="Editar" arrow>
                                                <IconButton
                                                    onClick={() => setEditProduct(prod)}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: "primary.light",
                                                        transition: "all 0.2s",
                                                        "&:hover": {
                                                            backgroundColor: "primary.main",
                                                            color: "primary.contrastText",
                                                        },
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir" arrow>
                                                <IconButton
                                                    onClick={() => handleDelete(prod)}
                                                    color="error"
                                                    size="small"
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: "error.light",
                                                        transition: "all 0.2s",
                                                        "&:hover": {
                                                            backgroundColor: "error.main",
                                                            color: "error.contrastText",
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                )}
                            </ListItem>
                        ))
                    )}
                </List>
            )}

            {/* Modal de seleção de imagens */}
            <Dialog
                open={openImageModal}
                onClose={() => setOpenImageModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Selecionar Imagens do Produto</DialogTitle>
                <DialogContent dividers>
                    {loadingImagesProducts ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : imagesProducts && imagesProducts.length > 0 ? (
                        <Grid container spacing={2}>
                            {imagesProducts.map((img) => {
                                const isSelected = editProduct ? editProduct.images?.some((item) => item.id === img.id) : newProduct.images?.some((item) => item.id === img.id);
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
        </Paper>
    );
}
