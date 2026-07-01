import React from 'react';
import { useLoadProducts } from '../../services/UseQuery/ProductsQuery';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Inventory } from '@mui/icons-material';
import { Chip } from '@mui/material';
import Banner from '../Banner';
import Categories from '../Tabs';

// import { Container } from './styles';

export default function Card2() {
    const {products}=useLoadProducts();
    const theme = useTheme();
  return <>
  <Banner/>
  <Categories/>
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
                                            <Inventory fontSize="large" color="action" />
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

                                        {/* <Box sx={{ display: "flex", gap: 1, alignSelf: { xs: "flex-end", sm: "center" } }}>
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
                                        </Box> */}
                                    </Box>
                            </ListItem>
                        ))
                    )}
                </List></>;
}

