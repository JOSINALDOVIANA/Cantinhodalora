import React from 'react';
import { useLoadProducts } from '../../services/UseQuery/ProductsQuery.jsx';
import { DadosContext } from '../../services/Contexts/DadosContext.jsx';
import ProductCard from '../../components/Grid/card.jsx';
import { Grid } from '@mui/material';
// import { Container } from './styles';

export default function Products() {

    const { products } = useLoadProducts();
    const { Dados, setDados } = React.useContext(DadosContext);
    return (
        <>
            <Grid sx={{ justifyContent: 'center' }} container spacing={1}>
                {
                    products?.map((produto, index) => (
                        <Grid
                            xs={6}
                            md={4}
                            lg={3}
                            key={index}>
                            <ProductCard onClick={() => { setDados(a => ({ ...a, ProductDataEdit: produto })) }} produto={produto} />
                        </Grid>
                    ))
                }
            </Grid>
        </>
    );
}
