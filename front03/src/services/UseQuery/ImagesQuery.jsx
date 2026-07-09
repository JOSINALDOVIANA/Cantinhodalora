import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";
import Swal from "sweetalert2";
import React from "react";




// Hook para carregar imagens de produtos (load)
export function useLoadImagesProducts() {


    const {
        data: imagesProducts,
        isLoading: loadingImagesProducts,
        error,
        refetch
    } = useQuery({
        queryKey: ["images"],
        queryFn: async () => {
            const { data } = await api.get("/api/images/getAllImages?is_product=1");
            return data.images;
        },
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
            // console.log("Buscando imagens de usuários...");
            const { data } = await api.get("/api/images/getAllImages");

            return data.images;
        },
        enabled: true, // vai buscar quando o usuario solicitar
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });


    return { imagesUsers, loadingImagesUsers, error, refetchImagesUsers };
}


export function useDeleteImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationfn: async (image) => {
           const data = await api.delete(`/api/images?id=${image.id}&key=${image.Key}`);
            return data;
        },
        
    }

    );
}