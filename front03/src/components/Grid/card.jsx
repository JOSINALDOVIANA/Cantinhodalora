import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,

} from '@mui/material';


// import { Url_img } from '../../Routes/index.jsx';
import { alpha, useTheme } from "@mui/material/styles";


export default function ProductCard({ produto, ...props }) {
  const theme = useTheme()

  return (
    <>
      <React.Suspense fallback={<Box sx={{ height: 100 }}>Carregando...</Box>}>
        <Card  {...props} elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 170, // limite opcional
            minWidth: 170,
            maxHeight: 340,
            minHeight: 340,
            boxShadow: 3,
            borderRadius: 2,
            justifyContent: 'space-between',
            gap: 1,
            // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,

          }}
        >
          <CardMedia
            component="img"
            alt={produto?.name}
            image={produto?.urlFull}
            sx={{

              objectFit: "cover",
              maxWidth: '100%',
              minHeight: 150,
              maxHeight: 150,
              // borderRadius: "0px 50px 0px 50px",
              // padding: 1,
              // margin: 1,
              // border: `2px solid ${theme.palette.primary.main}`,

              // WebkitMaskImage: `linear-gradient(to top, transparent 0.1%, ${theme.palette.mode === "dark" ? "#000" : "#fff"
              // } 10%)`
            }}
          />
          <CardContent
            sx={{
              minHeight: 200,
              maxHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // alignContent: "space-between",
              // alignItems: "flex-end",
              // justifyItems: "flex-end",
              padding: 1,
              gap: 1,
            }}
          >
            <Box sx={{ mb: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {produto.name}
              </Typography>
              <Chip
                label={produto.size}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, marginRight: 1 }}
              />
              <Chip
                label={`Estoque: ${produto.unit || 0}`}
                size="small"
                variant="outlined"
                color={produto.unit > 0 ? "success" : "error"}
                sx={{ fontWeight: 500, height: 20 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Categorias:
              </Typography>
              <Box>
                {produto.categories.map((c) => (
                  <Chip
                    key={c.id || c.description}
                    label={c.description}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.75rem",
                      backgroundColor: "action.selected",
                      "&:not(:last-child)": {
                        marginRight: 1, // adiciona espaço apenas se não for o último
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Chip
              label={`R$ ${parseFloat(produto.price || 0).toFixed(2)}`}
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
      </React.Suspense>
    </>

  );
}
