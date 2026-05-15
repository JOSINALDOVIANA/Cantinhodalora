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
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 150, // limite opcional
        minWidth: 150,
        maxHeight: 200,
        minHeight: 200,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        justifyContent: 'space-between',
      }}
    >
      <CardMedia
        component="img"
        alt={produto?.name}
        image={produto?.url}
        sx={{

          objectFit: "cover",
          maxWidth: '100%',
          minHeight: '50%',
          maxHeight: '50%',
          WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${theme.palette.mode === "dark" ? "#000" : "#fff"
            } 10%)`
        }}
      />
      <CardContent
        sx={{
          minHeight: "40%",
          maxHeight: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" } }} component="p" >
          {produto.name + ' ' + produto.size}
        </Typography>


        <Typography component='p' sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" }, color: red[500], fontWeight: 'bold' }}>
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
    </Card >
  );
}
