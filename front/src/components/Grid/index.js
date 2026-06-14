import { DadosContext } from '../../routs.js';
import React, { useState } from 'react';
import { alpha, Box, Container, Grid, Stack,Typography, useTheme } from '@mui/material';
import { purple } from '@mui/material/colors';

import { api } from '../../services/api/index.js';
import ProductCard from './cards.js';
import Banner from '../Banner/index.js'
import Categories from '../Tabs/index.js'


export default function ProductGrid() {
  const [Dados, setDados] = React.useContext(DadosContext);
  
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
    <Banner/>
    <Categories/>
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
