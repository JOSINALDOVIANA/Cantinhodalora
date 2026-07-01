import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";


// Função para buscar imagens de produtos
const fetchImagesProducts = async () => {
    const { data } = await api.get("/api/images/getAllImages?is_product=1");
    return data.images;
};

// Hook para carregar imagens de produtos (load)
export function useLoadImagesProducts() {
    const refreshImages = useRefreshImages();

    const {
        data: imagesProducts,
        isLoading: loadingImagesProducts,
        error,
    } = useQuery({
        queryKey: ["images"],
        queryFn: fetchImagesProducts,
        enabled: true, // vai buscar quando o usuario solicitar
        staleTime: 60000,  // cache válido por 1 min
        gcTime: 300000,    // garbage collector em 5 min
    });


    return { imagesProducts, loadingImagesProducts, error, refreshImages };
}
// Hook para refresh    
export function useRefreshImages() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["images"] });
    };
}