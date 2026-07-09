import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert,
    Tooltip,
    Zoom,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    Upload,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useDeleteImage, useLoadImagesProducts } from "../../services/UseQuery/ImagesQuery";
import UploadImageProd from "../../functions/UploadImageProd";

export default function ImagesManager() {
    const { imagesProducts, loadingImagesProducts, refreshImages, error } = useLoadImagesProducts();
    const deleteMutation = useDeleteImage();
    const handleDelete = (img) => {
        Swal.fire({
            title: "Tem certeza?",
            text: `Você deseja excluir a categoria "${cat.description}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(img);
                Swal.fire({
                    title: "Excluída!",
                    text: "A categoria foi removida com sucesso.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 4,
                borderRadius: 4,
                maxWidth: 600,
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
                        // color: "text.primary",
                        letterSpacing: "-0.5px",
                    }}
                >
                    Gerenciar Images/Produtos
                </Typography>
                <Tooltip title="Atualizar Lista" arrow 
                // TransitionComponent={Zoom}
                >
                    <IconButton
                        onClick={refreshImages}
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

            {/* Adicionar Image */}
            <Box
                component="form"
                onSubmit={e => {
                    e.preventDefault();
                    refreshImages();
                }}
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 4,
                }}
            >
                <UploadImageProd props={{upUrl:'/api/images/uploadProduct', rrefetchImages:()=>refreshImages()}} />
                {/* <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{
                        borderRadius: 2,
                        px: 3.5,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": {
                            boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.2)",
                        },
                    }}
                >
                    Adicionar
                </Button> */}
            </Box>

            {/* Conteúdo principal / Lista */}
            {loadingImagesProducts ? (
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
                        Carregando Images...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Erro ao carregar Images. Por favor, tente novamente mais tarde.
                </Alert>
            ) : (
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        p: 0,
                    }}
                >
                    {imagesProducts?.length === 0 ? (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 6, fontStyle: "italic" }}
                        >
                            Nenhuma Image encontrada. Crie uma acima!
                        </Typography>
                    ) : (
                        imagesProducts?.map((img) => (
                            <ListItem
                                key={img?.id}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    justifyContent: "space-between",
                                    borderRadius: 3,
                                    bgcolor: "background.paper",
                                    transition: "all 0.25s ease-in-out",
                                    "&:hover": {
                                        borderColor: "primary.light",
                                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.03)",
                                        transform: "translateY(-2px)",
                                    },
                                    p: 2,
                                }}
                            >
                                {false ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            gap: 2,
                                            alignItems: "center",
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={editCategory.description}
                                            onChange={(e) =>
                                                setEditCategory({
                                                    ...editCategory,
                                                    description: e.target.value,
                                                })
                                            }
                                            autoFocus
                                            placeholder="Nome da categoria"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="Salvar Alterações" arrow>
                                                <IconButton
                                                    onClick={handleSaveEdit}
                                                    color="success"
                                                    size="small"
                                                    sx={{
                                                        border: "1px solid",
                                                        borderColor: "success.light",
                                                        transition: "all 0.2s",
                                                        "&:hover": {
                                                            backgroundColor: "success.main",
                                                            color: "success.contrastText",
                                                        },
                                                    }}
                                                >
                                                    <SaveIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Cancelar" arrow>
                                                <IconButton
                                                    onClick={() => setEditCategory(null)}
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
                                                    <CancelIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                ) : (
                                    <>
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" sx={{width:100,height:100}} alt={img?.name} src={img?.urlfull||img?.url} />
                                        </ListItemAvatar>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            {/* <Tooltip title="Editar" arrow>
                                                <IconButton
                                                    onClick={() => setEditCategory(cat)}
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
                                            </Tooltip> */}
                                            <Tooltip title="Excluir" arrow>
                                                <IconButton
                                                    onClick={() => handleDelete(img)}
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
                                    </>
                                )}
                            </ListItem>
                        ))
                    )}
                </List>
            )}
        </Paper>
    );
}
