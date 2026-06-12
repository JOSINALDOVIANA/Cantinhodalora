import React, { useState } from 'react';
import { alpha, Box, Container, Grid, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { api } from '../../api/index.js';
import ProductCard from './index.js'; // importa o card que criamos antes
import { DadosContext } from '../../routs.js';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import { purple } from '@mui/material/colors';


export default function ProductGrid() {
  const [Dados, setDados] = React.useContext(DadosContext);
   const [activeCat, setActiveCat] = useState(100);
  const theme = useTheme();



  React.useEffect(() => {
    api.get('/api/products').then(response => {
      // console.log('response.data.produtos', response);
      setDados(a => ({ ...a, productsSearch: response.data.produtos, products: response.data.produtos }))
    });
    api.get('/api/categories').then(response => {
      // console.log('response.data.categories', response);
      setDados(a => ({ ...a, categories: response.data.categories }))
    });
  }, []);

  // console.log(Dados)

  return (

    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            filter: "blur(80px)",
          }}
        />
       
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 9, sm: 9 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 4, color: "primary.light", display: "block", mb: 1 }}
          >
            Carta de Outono · 2026
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "3.25rem" },
              lineHeight: 1.05,
              maxWidth: 820,
            }}
          >
            venha viver a experiência Cantinho da Lora.{" "}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              Uma bebida bem gelada
            </Box>{" "}
            e um bom atendimento.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
            Confira nossos produtos, filtre por categorias ou pesquise pelo nome do produto. 
            Peça aos bartenders que eles cuidam do resto. Beba com moderação.
          </Typography>
        </Container>
      </Box>
      <Box
        sx={{
          position: "sticky",
          top: 55,
          zIndex: 5,
          
          // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
          backdropFilter: "blur(8px)",
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
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
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                 <SportsBarOutlinedIcon sx={{ color: purple[100] }} />
                <span>Todos</span>
              </Stack>
            } />
            {Dados?.categories?.map((c) => (
              <Tab
                key={c.id}
                value={c.id}
                label={
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                     <SportsBarOutlinedIcon sx={{ color: purple[100] }} />
                    <span>{c.description}</span>
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Container>
      </Box>
      <Grid sx={{ justifyContent: "center", pb: 2 }} container spacing={1} >
        {Dados?.productsSearch?.map((produto, index) => (
          <Grid
            xs={6}
            md={4}
            lg={3}
            key={index}>
            <ProductCard produto={produto} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
