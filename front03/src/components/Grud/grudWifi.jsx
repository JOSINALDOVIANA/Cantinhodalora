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
import { useAddWifi, useDeleteWifi, useUpdateWifiConfig, useWifiConfig } from "../../services/UseQuery/WifiQuery";


export default function WifiManager() {
    const { WifiConfig,loadingWifiConfig,erroWifi,refetchWifiConfig } = useWifiConfig();
    const addMutation = useAddWifi();
    const updateMutation = useUpdateWifiConfig();
    const deleteMutation = useDeleteWifi();
  

    const [newWifi, setNewWifi] = useState(null);
    const [editWifi, setEditWifi] = useState(null);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newWifi?.ssid.trim()) return;
        addMutation.mutate({ ...newWifi });
        setNewCategory(null);
    };

    const handleSaveEdit = () => {
        if (!editWifi?.ssid.trim()) return;
        updateMutation.mutate(editWifi);
        setEditCategory(null);
    };

    const handleDelete = (wifi) => {
        Swal.fire({
            title: "Tem certeza?",
            text: `Você deseja excluir a a rede "${WifiConfig?.ssid}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
               const status= deleteMutation.mutate({ ...wifi});
                status && Swal.fire("Deletado!", "A rede foi deletada.", "success");
                !status && Swal.fire("Erro!", "Ocorreu um erro ao deletar a rede.", "error");
            }
        });
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 4,
                maxWidth: 700,
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
                    Gerenciar Redes Wi-Fi
                </Typography>
                <Tooltip title="Atualizar Lista" arrow TransitionComponent={Zoom}>
                    <IconButton
                        onClick={refetchWifiConfig}
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

            {/* Adicionar wifi form */}
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
                    label="Novo Wi-Fi"
                    variant="outlined"
                    value={newWifi?.ssid}
                    onChange={(e) => setNewWifi(a => ({ ...a, ssid: e.target.value }))}
                    placeholder="Ex: CantinhodaLora..."
                    sx={{
                        width: 'auto',
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                        },
                    }}
                />
                <TextField
                    fullWidth
                    size="small"
                    label="Senha"
                    variant="outlined"
                    value={newWifi?.password}
                    onChange={(e) => setNewWifi(a => ({ ...a, password: e.target.value }))}
                    placeholder=""
                    sx={{
                        width: 'auto',
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
                        overflow: "hidden",
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
            {loadingWifiConfig ? (
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
            ) : erroWifi ? (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Erro ao carregar as redes. Por favor, tente novamente mais tarde.
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
                    {WifiConfig?.length === 0 ? (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 6, fontStyle: "italic" }}
                        >
                            Nenhuma rede encontrada. Crie uma acima!
                        </Typography>
                    ) : (
                        WifiConfig?.map((w) => (
                            <ListItem
                                key={w.id}
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
                                {editWifi?.id === w.id ? (
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
                                            value={editWifi?.ssid}
                                            onChange={(e) =>
                                                setEditWifi({
                                                    ...editWifi,
                                                    ssid: e.target.value,
                                                })
                                            }
                                            autoFocus
                                            placeholder="Nome da Rede Wi-Fi"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={editWifi?.password}
                                            onChange={(e) =>
                                                setEditWifi({
                                                    ...editWifi,
                                                    password: e.target.value,
                                                })
                                            }
                                            autoFocus
                                            placeholder="Nome da Rede Wi-Fi"
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
                                                    onClick={() => setEditWifi(null)}
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
                                            primary={w.ssid}
                                            primaryTypographyProps={{
                                                fontWeight: 600,
                                                color: "text.primary",
                                                fontSize: "1rem",
                                            }}
                                        />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Tooltip title="Editar" arrow>
                                                <IconButton
                                                    onClick={() => setEditWifi(w)}
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
