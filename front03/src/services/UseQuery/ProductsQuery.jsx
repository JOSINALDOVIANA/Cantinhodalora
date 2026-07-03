import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

// Função para buscar produtos
const fetchProducts = async () => {
    const { data } = await api.get("/api/products");
    return data.dados;
};

// Função para atualizar produto
const updateProduct = async (payload) => {
    // console.log(payload)
    const { data } = await api.put(`/api/products/${payload?.id}`, { ...payload });
    return data;
    // return {}
};
// Função para add produto
const addProduct = async (payload) => {
    const { data } = await api.post(`/api/products`, { ...payload });
    return data;
};
// Função para deletar produto
const delProduct = async (payload) => {
    const { data } = await api.delete(`/api/products/${payload?.id}`);
    return data;
};

// Hook para carregar produtos (load)
export function useLoadProducts() {
    const refreshProducts = useRefreshProducts();
    const {
        data: products,
        isLoading: loadingProducts,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
        enabled: true // não vai buscar direto, só quando for chamado
    });

    return { products, loadingProducts, error, refreshProducts };
}

// Hook para refresh (basicamente revalida a query)
export function useRefreshProducts() {
    // console.log('refreshProducts')
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
    };
}

// Hook para update
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

// Hook para deletar produto
export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: delProduct,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
// Hook para adicionar produto
export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
