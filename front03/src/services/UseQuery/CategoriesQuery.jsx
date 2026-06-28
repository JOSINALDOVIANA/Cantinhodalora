import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

// Função para buscar categorias
const fetchCategories = async () => {
    const { data } = await api.get("/api/categories");
    return data.categories;
};

// Função para atualizar categoria
const updateCategory = async (payload) => {
    const { data } = await api.put(`/api/categories/${payload?.id}`, { ...payload });
    return data;
};
// Função para add   categoria
const addCategory = async (payload) => {
    const { data } = await api.post(`/api/categories/`, { ...payload });
    return data;
};
// Função para delete   categoria
const deleteCategory = async (payload) => {
    const { data } = await api.delete(`/api/categories/${payload?.id}`, { ...payload });
    return data;
};

// Hook para carregar categorias
export function useLoadCategories() {
    const {
        data: categories,
        isLoading: loadingCategories,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });

    return { categories, loadingCategories, error };
}

// Hook para refresh (revalida a query)
export function useRefreshCategories() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
    };
}

// Hook para update
export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
// Hook para add
export function useAddCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

// Hook para delete
export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
