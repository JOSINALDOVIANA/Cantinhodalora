import { DadosContext } from '../../services/Contexts/DadosContext.jsx';
import React, { useEffect } from 'react';
import { Box, CssBaseline, Grid, useTheme } from '@mui/material';



import ProductCard from './card.jsx';
import Banner from '../Banner/index.jsx'
import Categories from '../Tabs/index.jsx'
import { useLoadProducts } from '../../services/UseQuery/ProductsQuery.jsx';

export default function ProductGrid() {
  const { Dados, setDados } = React.useContext(DadosContext);
  const { products, loadingProducts } = useLoadProducts();
  useEffect(() => {
    setDados(prev => ({ ...prev, productsSearch: products }));
  }, [products]);

  const theme = useTheme();





  return (

    <>
      <React.Suspense fallback={<Box sx={{ height: 100 }}>Carregando...</Box>}>
        <CssBaseline />
        {window.location.pathname !== "/minha-conta" && <Banner />}
        {window.location.pathname !== "/minha-conta" && <Categories />}
        <Grid  sx={{ justifyContent: "center", pb: 2, backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper }} container spacing={2} >
          {loadingProducts && <Box sx={{ height: 100 }}>Carregando...</Box>}
          {!loadingProducts && Dados?.productsSearch?.map((produto, index) => (
            <Grid
              xs={6}
              md={4}
              lg={3}
              key={index}>
              <ProductCard produto={produto} />
            </Grid>
          ))}
        </Grid>
      </React.Suspense>
    </>
  );
}
