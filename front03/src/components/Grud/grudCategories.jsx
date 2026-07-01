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
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
    useLoadCategories,
    useAddCategory,
    useUpdateCategory,
    useDeleteCategory,
    useRefreshCategories,
} from "../../services/UseQuery/CategoriesQuery.jsx"; // ajuste o caminho conforme sua estrutura

export default function CategoriesManager() {
    const { categories, loadingCategories, error } = useLoadCategories();
    const refreshCategories = useRefreshCategories();

    const addMutation = useAddCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [newCategory, setNewCategory] = useState("");
    const [editCategory, setEditCategory] = useState(null);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        addMutation.mutate({ description: newCategory.trim() });
        setNewCategory("");
    };

    const handleSaveEdit = () => {
        if (!editCategory?.description?.trim()) return;
        updateMutation.mutate(editCategory);
        setEditCategory(null);
    };

    const handleDelete = (cat) => {
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
                deleteMutation.mutate({ id: cat.id });
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
                    Gerenciar Categorias
                </Typography>
                <Tooltip title="Atualizar Lista" arrow TransitionComponent={Zoom}>
                    <IconButton
                        onClick={refreshCategories}
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

            {/* Adicionar categoria form */}
            <Box
                component="form"
                onSubmit={handleAdd}
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 4,
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    label="Nova Categoria"
                    variant="outlined"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Ex: Bebidas, Doces, Lanches..."
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                    }}
                />
                <Button
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
                </Button>
            </Box>

            {/* Conteúdo principal / Lista */}
            {loadingCategories ? (
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
                        Carregando categorias...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Erro ao carregar categorias. Por favor, tente novamente mais tarde.
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
                    {categories?.length === 0 ? (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 6, fontStyle: "italic" }}
                        >
                            Nenhuma categoria encontrada. Crie uma acima!
                        </Typography>
                    ) : (
                        categories?.map((cat) => (
                            <ListItem
                                key={cat.id}
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
                                    p: 2,
                                }}
                            >
                                {editCategory?.id === cat.id ? (
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
                                        <ListItemText
                                            primary={cat.description}
                                            primaryTypographyProps={{
                                                fontWeight: 600,
                                                color: "text.primary",
                                                fontSize: "1rem",
                                            }}
                                        />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="Editar" arrow>
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
                                            </Tooltip>
                                            <Tooltip title="Excluir" arrow>
                                                <IconButton
                                                    onClick={() => handleDelete(cat)}
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
