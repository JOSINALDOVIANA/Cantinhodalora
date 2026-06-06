import { useTheme, AppBar, Toolbar, Avatar, Box, Typography, TextField, InputAdornment, Button, Badge, alpha } from '@mui/material';
import React from 'react';
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import logo from '../../images/logo.png';

// import { Container } from './styles';

function AppBarTeste() {
    const theme = useTheme();
    return (
    <>
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: alpha(theme.palette.background.default, 0.85),
                backdropFilter: "blur(12px)",
                borderBottom: 1,
                borderColor: "divider",
                color: "text.primary",
            }}
        >
            <Toolbar sx={{ gap: 2, py: 1 }}>
                

                <Box sx={{ flex: 1, display: { xs: "none", md: "block" }, maxWidth: 460, mx: "auto" }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={''}
                        onChange={() => { }}
                        placeholder="Buscar drinks, ingredientes…"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 999, bgcolor: "background.paper" },
                            },
                        }}
                    />
                </Box>

                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { }}
                    startIcon={
                        <Badge badgeContent={9} color="secondary" overlap="circular">
                            <ReceiptLongIcon />
                        </Badge>
                    }
                    sx={{ fontWeight: 700, px: 2.5 }}
                >
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                        Comanda
                    </Box>
                </Button> */}
                <Avatar
                    variant="circular"
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        width: 44,
                        height: 44,
                        boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
                    }}
                >
                    <img src={logo} alt="Logo" style={{ width: "100%", height: "100%" }} />
                </Avatar>
                <Box sx={{ flexShrink: 0 }}>
                    <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                        Cantinho da Lora
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Quiosque/Bar · Aberto até 2h
                    </Typography>
                </Box>

            </Toolbar>

            <Box sx={{ px: 2, pb: 1.5, display: { xs: "block", md: "none" } }}>
                <TextField
                    fullWidth
                    size="small"
                    value={''}
                    onChange={() => { }}
                    placeholder="Buscar drinks…"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 999, bgcolor: "background.paper" },
                        },
                    }}
                />
            </Box>
        </AppBar>
    </>)
}

export default AppBarTeste;