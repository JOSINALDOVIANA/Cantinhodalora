import { Box, Container, Typography, useTheme } from '@mui/material';
import React from 'react';


function Banner() {
  const theme=useTheme();
  return (<>
  <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        
       
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
  </>);
}

export default Banner;