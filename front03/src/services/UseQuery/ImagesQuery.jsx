import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import Swal from "sweetalert2";
import React from "react";


// Função para buscar imagens de produtos
const fetchImagesProducts = async () => {
    const { data } = await api.get("/api/images/getAllImages?is_product=1");
    return data.images;
};

// Hook para carregar imagens de produtos (load)
export function useLoadImagesProducts() {


    const {
        data: imagesProducts,
        isLoading: loadingImagesProducts,
        error,
        refetch
    } = useQuery({
        queryKey: ["images"],
        queryFn: fetchImagesProducts,
        enabled: true, // vai buscar quando o usuario solicitar
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });


    return { imagesProducts, loadingImagesProducts, error, refreshImages: refetch };
}
// Hook para carregar imagens de users (load)
export function LoadImagesUsers() {
    const [progress, setProgress] = React.useState(0);

    const {
        data: imagesUsers,
        isLoading: loadingImagesUsers,
        error,
        refetch: refetchImagesUsers
    } = useQuery({
        queryKey: ["imagesUsers"],
        queryFn: async () => {
            console.log("Buscando imagens de usuários...");
            const { data } = await api.get("/api/images/getAllImages");
                  
            return data.images;
        },
        enabled: true, // vai buscar quando o usuario solicitar
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });


    return { imagesUsers, loadingImagesUsers, error, refetchImagesUsers };
}
// Hook para refresh    
export function useRefreshImages() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["images"] });
    };
}

export function useDeleteImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationfn: async (image) => {
            await api.delete(`/api/images?id=${image.id}&key=${image.Key}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["images"] });
        }
    }

    );
}