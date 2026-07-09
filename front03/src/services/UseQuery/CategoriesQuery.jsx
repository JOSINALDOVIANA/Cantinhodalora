import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";







// Hook para carregar categorias
export function useLoadCategories() {
    const {
        data: categories,
        isLoading: loadingCategories,
        error,
        refetch: refetchCategories
    } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get("/api/categories");
            return data.categories;
        },
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });

    return { categories, loadingCategories, error, refetchCategories };
}
// Hook para update
export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            console.log("entrou aqui ")
            const { data } = await api.put(`/api/categories/${payload?.id}`, { ...payload });
            return data;
        },
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
        mutationFn: async (payload) => {
            const { data } = await api.post(`/api/categories`, payload);
            return data;
        },
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
        mutationFn: async (payload) => {
            const { data } = await api.delete(`/api/categories/${payload?.id}`);
            return data;
        },
        onSuccess: () => {
            // Após atualizar, força refresh da lista
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
