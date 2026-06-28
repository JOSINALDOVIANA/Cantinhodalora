import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { DadosContext } from '../Contexts/DadosContext.jsx';
//import { useLoadProducts, useRefreshProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '../UseQuery/ProductsQuery.jsx';
// import { useLoadCategories, useRefreshCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '../UseQuery/CategoriesQuery.jsx';
// import { useAddUser, useDeleteUser, useRefreshUser, useUpdateUser } from '../UseQuery/UsersQuery.jsx';




export function DadosProvider({ children }) {
    // const queryClient = useQueryClient();
    // Query
    // const { products, loadingProducts } = useLoadProducts();
    // const { categories, loadingCategories } = useLoadCategories();
    // const { user, loadingUser } = useRefreshUser();

    // Hook
    // const { refreshProducts } = useRefreshProducts();
    // const { updateProduct } = useUpdateProduct();
    // const { deleteProduct } = useDeleteProduct();
    // const { addProduct } = useAddProduct();
    // const { updateCategory } = useUpdateCategory();
    // const { deleteCategory } = useDeleteCategory();
    // const { addCategory } = useAddCategory();
    // const { refreshCategories } = useRefreshCategories();
    // const { refreshUser } = useRefreshUser();
    // const { updateUser } = useUpdateUser();
    // const { deleteUser } = useDeleteUser();
    // const { addUser } = useAddUser();



    const [Dados, setDados] = useState({
        productsSearch: [],
        logado: false,
    });

    // useEffect(() => {
    //     setDados(prev => ({ ...prev, productsSearch: products }));
    // }, [products]);








    const value = {
        Dados,
        setDados,
        // products,
        // loadingProducts,
        // refreshProducts,
        // updateProduct,
        // deleteProduct,
        // addProduct,
        // categories,
        // loadingCategories,
        // refreshCategories,
        // updateCategory,
        // deleteCategory,
        // addCategory,
        // user,
        // loadingUser,
        // refreshUser,
        // updateUser,
        // deleteUser,
        // addUser,

    };

    return (
        <DadosContext.Provider value={value}>
            {children}
        </DadosContext.Provider>
    );
}


