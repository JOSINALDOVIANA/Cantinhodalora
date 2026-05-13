import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,

} from '@mui/material';


import { Url_img } from '../../routs.js';
import { useTheme } from "@mui/material/styles";

export default function ProductCard({ produto, ...props }) {
  const theme = useTheme()

  return (
    <Card {...props} elevation={3}
      sx={{
        minWidth: 250,
        maxWidth: 250,
        margin: "auto",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardMedia
        component="img"

        image={produto?.url || Url_img}
        alt={produto?.name}
        sx={{
          objectFit: "", // mantém proporção e encaixa no espaço
          width: "100%",        // ocupa toda a largura do card
          height: 200,          // altura fixa
          WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${theme.palette.mode === "dark" ? "#000" : "#fff"
            } 20%)`
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {produto.name+' '+produto.size}
        </Typography>

        {/* <Typography
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {produto.description}
        </Typography> */}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Estoque: {produto?.unit} unidades
        </Typography>
        <Typography variant="h6" color="warning" sx={{ mt: 1 }}>
          R$ {produto?.price.toFixed(2)}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small" variant="contained" color="primary">
          Comprar
        </Button>
        <Button size="small" variant="outlined">
          Detalhes
        </Button>
      </CardActions> */}
    </Card>
  );
}
