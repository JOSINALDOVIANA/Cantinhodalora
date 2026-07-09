import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";


const fetchWifiConfig = async () => {
    const { data } = await api.get('/api/wifi');
    // console.log("fetchWifiConfig", data)
    return data.wifiConfigs;
}

export function useWifiConfig() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['wifiConfig'],
        queryFn: () => fetchWifiConfig(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        retry: true,
        staleTime: 1000 * 60 * 5, // cache por 5 minutos
        gcTime: 1000 * 60 * 10, // não deixa a aplicação usar o cache por mais de 10 minutos

    });
    return { WifiConfig: data, loadingWifiConfig: isLoading, erroWifi:error, refetchWifiConfig: refetch };
}

export function useUpdateWifiConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (wifiConfig) => {
            const { data } = await api.put(`/api/wifi/${wifiConfig.id}`, wifiConfig);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wifiConfig']);
        },
    });
   
}

export function useAddWifi() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (wifiConfig) => {
            const { data } = await api.post('/api/wifi', wifiConfig);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wifiConfig']);
        },
    });
        
    };
export function useDeleteWifi() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (wifiConfig) => {
            const { data } = await api.delete(`/api/wifi/${wifiConfig.id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wifiConfig']);
            return true;
        },
    });
        
    };

