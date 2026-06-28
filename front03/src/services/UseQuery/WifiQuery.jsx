import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.jsx";

export function WifiQuery() {
    const queryClient = useQueryClient();
    const { data: WifiConfig, isLoading: loadingWifiConfig } = useQuery({
        queryKey: ['wifiConfig'],
        queryFn: async () => {
            const response = await api.get('/api/wifi');
            return response.data.wifiConfigs[0];
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
    });

    const updateWifiConfig = useMutation({
        mutationFn: async (wifiConfig) => {
            const response = await api.put(`/api/wifi/${wifiConfig.id}`, wifiConfig);
            return response.data.wifiConfig;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['wifiConfig']);
        },
    });


    return { WifiConfig, loadingWifiConfig, updateWifiConfig }
}