import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

// Função para buscar produtos
const fetchProducts = async () => {
    const { data } = await api.get("/api/products");
    return data.produtos;
};

// Função para atualizar produto
const updateProduct = async (payload) => {
    const { data } = await api.put(`/api/products/${payload?.id}`, { ...payload });
    return data;
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
    const {
        data: products,
        isLoading: loadingProducts,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });

    return { products, loadingProducts, error };
}

// Hook para refresh (basicamente revalida a query)
export function useRefreshProducts() {
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
