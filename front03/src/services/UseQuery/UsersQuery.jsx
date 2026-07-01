import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../api";

// Função para buscar dados do usuário
const fetchUser = async () => {
    const { data } = await api.post("/api/users/refresh");
    return data.user;
};
// Função para buscar todos os usuarios do sistema
const fetchUsersSystem = async () => {
    const { data } = await api.get("/api/users");
    return data;
};
// função para add usuario
const addUser = async (dados) => {
    const { data } = await api.post("/api/users", { ...dados });
    return data;
}
// função para delete usuario
const deleteUser = async (data) => {
    const { data: response } = await api.delete(`/api/users/${data?.id}`, { ...data });
    return data;
}
// Função para login
const loginUser = async (credentials) => {
    // console.log("credentials", credentials)
    const { data } = await api.post("/api/users/login", credentials);
    return data;
};

// Função para atualizar usuário
const updateUser = async (d) => {
    const { data } = await api.put(`/api/users/${d?.id}`, { ...d });
    return data;
};

// hook para pegar dados do usuario logado
export function useRefreshUser() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["refreshUser"],
        queryFn: async () => await fetchUser(),
        staleTime: 1000 * 60 * 5, // cache por 5 minutos
        gcTime: 1000 * 60 * 10, // não deixa a aplicação usar o cache por mais de 10 minutos
        refetchOnWindowFocus: false, // não busca no windows focus
        refetchOnReconnect: false, // não busca no reconnect
        // refetchOnMount: false, // não busca no mount
        // retry: false, // não tenta novamente em caso de erro
    });
    return { user: data, error, loadingUser: isLoading };
}
// hook para login
export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials) => loginUser(credentials), // passa a função, não executa
        onSuccess: (response) => {
            // Salva o token no localStorage
            //   localStorage.setItem("token", response.token);

            // Atualiza os dados do usuário após login
            queryClient.invalidateQueries({ queryKey: ["refreshUser"] });
        },
    });
}
// hook para atualizar dados do usuario
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            // Atualiza os dados do usuário após update
            queryClient.invalidateQueries({ queryKey: ["refreshUser"] });
        },
    });
}
// hook para deletar usuario
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // Atualiza os dados do usuário após delete
            queryClient.invalidateQueries({ queryKey: ["refreshUser"] });
        },
    });
}
// hook para adicionar usuario
export function useAddUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            // Atualiza os dados do usuário após add
            queryClient.invalidateQueries({ queryKey: ["refreshUser"] });
        },
    });
}
// hook para buscar todos os usuarios do sistema
export function useFetchUsersSystem() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["usersSystem"],
        queryFn: fetchUsersSystem,
        staleTime: 1000 * 60 * 5, // cache por 5 minutos
        gcTime: 1000 * 60 * 10, // não deixa a aplicação usar o cache por mais de 10 minutos
        refetchOnWindowFocus: false, // não busca no windows focus
        refetchOnReconnect: false, // não busca no reconnect
        // refetchOnMount: false, // não busca no mount
        // retry: false, // não tenta novamente em caso de erro
    });
    return { usersSystem: data, error, loadingUsersSystem: isLoading };
}

// Hook para refresh usersSystem  (basicamente revalida a query)
export function useRefreshUsersSystem() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["usersSystem"] });
    };
}
// hook para fazer logout
export function useLogout() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["refreshUser"] });
    };
}

