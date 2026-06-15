import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,

} from '@mui/material';


// import { Url_img } from '../../Routes/index.jsx';
import { alpha, useTheme } from "@mui/material/styles";
import { purple, red } from '@mui/material/colors';

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
        maxHeight: 250,
        minHeight: 250,
        boxShadow: 3,
        borderRadius: 2,
        justifyContent: 'space-between',
        // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,

      }}
    >
      <CardMedia
        component="img"
        alt={produto?.name}
        image={produto?.url}
        sx={{

          objectFit: "cover",
          maxWidth: '100%',
          minHeight: 150,
          maxHeight: 150,
          // WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${theme.palette.mode === "dark" ? "#000" : "#fff"
          // } 10%)`
        }}
      />
      <CardContent
        sx={{
          minHeight: 70,
          maxHeight: 70,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // alignContent: "space-between",
          // alignItems: "flex-end",
          justifyItems: "flex-end",
          padding: 1,
        }}
      >
        <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" } }} component="p" >
          {produto.name + ' ' + produto.size}
        </Typography>


        <Typography component='p' sx={{
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" }, color: theme.palette.primary.main,
           fontWeight: 'bold'
        }}>
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
