import { Box, Container, Typography, useTheme } from '@mui/material';
import React from 'react';


function Banner() {
  const theme = useTheme();
  // console.log(theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper)
  return (<>
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderBottom: 1,
        borderColor: "#ffffff",
        marginTop: 10
        // backgroundColor:theme.palette.mode==='light'?theme.palette.primary.main:theme.palette.background.paper
      }}
    >

      <Box sx={{ backgroundColor: theme.palette.mode === 'light' ? "#ffff" : theme.palette.primary.main }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill={theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper} fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,202.7C480,213,600,203,720,181.3C840,160,960,128,1080,138.7C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </Box>
      <Box
        sx={{
          position: "relative",
          py: { xs: 9, sm: 9 },
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.primary.main,
          paddingLeft: 5
        }}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 4, color: "inherit", display: "block", mb: 1 }}
        >
          Carta de Outono · 2026
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "3.25rem" },
            lineHeight: 1.05,
            maxWidth: 'lg',
            color: 'inherit'
          }}
        >
          venha viver a experiência Cantinho da Lora.{" "}
          <Box
            component="span"
            sx={{
              background: theme.palette.primary.dark,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "revert-layer",
            }}
          >
            Uma bebida bem gelada
          </Box>{" "}
          e um bom atendimento.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 500, color: 'inherit', fontSize: { xs: 12, sm: 18 } }}>
          Confira nossos produtos, filtre por categorias ou pesquise pelo nome do produto.
          Peça aos bartenders que eles cuidam do resto. <span style={{ fontStyle: 'italic' }} >Beba com moderação.</span>
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill={theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.primary.main} fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,202.7C480,213,600,203,720,181.3C840,160,960,128,1080,138.7C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </Box>
    </Box>
  </>);
}

export default Banner;