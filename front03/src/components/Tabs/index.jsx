import React, { useContext, useState } from 'react';

import { Box, Container,Stack, useTheme } from '@mui/material';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { DadosContext } from '../../Routes/index.jsx';
import { purple } from '@mui/material/colors';

// import { Container } from './styles';

function Categories() {
    const [Dados, setDados] = useContext(DadosContext);
     const [activeCat, setActiveCat] = useState(100);
     const theme=useTheme();
    return (
    <>
        <Box
            sx={{
                position: "sticky",
                top: 55,
                zIndex: 5,

                // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
                backdropFilter: "blur(8px)",
                borderBottom: 1,
                borderColor: "#ffffff",
                mb: 2,
                backgroundColor:theme.palette.mode==='light'?theme.palette.primary.main:theme.palette.background.paper
            }}
        >
            <Container maxWidth="lg">
                <Tabs
                    value={activeCat}
                    onChange={(_, v) => {
                        // console.log('cat', v);
                        setActiveCat(v);
                        if (v === 100) {
                            setDados(a => ({ ...a, productsSearch: a.products }))
                        } else {
                            let prod = Dados?.products?.filter(p => p.categories?.find(c => c.id === v));
                            setDados(a => ({ ...a, productsSearch: [...prod] }))
                        }
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    slotProps={{
                        indicator: { sx: { height: 3, borderRadius: 2, bgcolor: "primary.main" } },
                    }}
                    sx={{
                        minHeight: 56,
                        "& .MuiTab-root": {
                            minHeight: 56,
                            fontWeight: 600,
                            color: "text.secondary",
                            "&.Mui-selected": { color: "primary.light" },
                        },
                    }}
                >
                    <Tab value={100} label={
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center",color:theme.palette.mode==='light'?theme.palette.background.default:null}}>
                            <SportsBarOutlinedIcon sx={{ color: purple[100] }} />
                            <span>Todos</span>
                        </Stack>
                    } />
                    {Dados?.categories?.map((c) => (
                        <Tab
                            key={c.id}
                            value={c.id}
                            label={
                                <Stack direction="row" spacing={1} sx={{ alignItems: "center",color:theme.palette.mode==='light'?theme.palette.background.default:null }}>
                                    <SportsBarOutlinedIcon sx={{ color: purple[100] }} />
                                    <span>{c.description}</span>
                                </Stack>
                            }
                        />
                    ))}
                </Tabs>
            </Container>
        </Box>
    </>);
}

export default Categories;