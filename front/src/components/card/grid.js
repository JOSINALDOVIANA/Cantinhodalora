import React from 'react';
import { Grid } from '@mui/material';
import { api } from '../../api/index.js';
import ProductCard from './index.js'; // importa o card que criamos antes
import { DadosContext } from '../../routs.js';


export default function ProductGrid() {
  const [Dados, setDados] = React.useContext(DadosContext);

  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {

    api.get('/api/products').then(response => setDados(a => ({ ...a, products: response.data.produtos })));
  }, []);


  return (
    <Grid sx={{ m: 2, p: 2 }} container spacing={2} >
      {Dados?.products?.map((produto, index) => (
        <Grid

          key={index}>
          <ProductCard produto={produto} />
        </Grid>
      ))}
    </Grid>
  );
}
