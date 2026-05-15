import React from 'react';
import { Grid } from '@mui/material';
import { api } from '../../api/index.js';
import ProductCard from './index.js'; // importa o card que criamos antes
import { DadosContext } from '../../routs.js';


export default function ProductGrid() {
  const [Dados, setDados] = React.useContext(DadosContext);



  React.useEffect(() => {

    api.get('/api/products').then(response => setDados(a => ({ ...a, products: response.data.produtos, productsSearch: response.data.produtos })));
  }, []);


  return (
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
  );
}
