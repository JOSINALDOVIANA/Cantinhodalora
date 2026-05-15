import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,

} from '@mui/material';


import { Url_img } from '../../routs.js';
import { useTheme } from "@mui/material/styles";
import { red } from '@mui/material/colors';

export default function ProductCard({ produto, ...props }) {
  const theme = useTheme()

  return (
    <Card  {...props} elevation={3}
      sx={{

        maxWidth: 200,
        minWidth: 200,
        maxHeight: 300,
        minHeight: 300,

        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "space-between",
      }}
    >
      <CardMedia
        component="img"

        image={produto?.url || Url_img}
        alt={produto?.name}
        sx={{
          objectFit: "cover", // mantém proporção e encaixa no espaço
          maxWidth: '100%',        // ocupa toda a largura do card
          minHeight: 170,
          maxHeight: 170,
          // altura fixa
          WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${theme.palette.mode === "dark" ? "#000" : "#fff"
            } 20%)`
        }}
      />
      <CardContent>
        <Typography gutterBottom component="p" noWrap>
          {produto.name + ' ' + produto.size}
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

        {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Estoque: {produto?.unit} unidades
        </Typography> */}
        <Typography variant="h6" sx={{ mt: 1, color: red[500], fontWeight: 'bold' }}>
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
