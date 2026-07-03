import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../api";
import { DadosContext } from "../Contexts/DadosContext";


// Função para buscar todos os usuarios do sistema

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
    // console.log("data", data)
    return data.user;
};

// Função para atualizar usuário
const updateUser = async (d) => {
    const { data } = await api.put(`/api/users/${d?.id}`, { ...d });
    return data;
};

// hook para pegar dados do usuario logado
export function useRefreshUser() {
    const { setDados } = React.useContext(DadosContext);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["refreshUser"],
        queryFn: async () => {
            // console.log("fetchUser");
            const { data } = await api.post("/api/users/refresh");
            if (!!data?.user){
            setDados(a => ({ ...a, logado: true, }));
            };
            return data.user;

        },
        staleTime: 1000 * 60 * 5, // cache por 5 minutos
        gcTime: 1000 * 60 * 10, // não deixa a aplicação usar o cache por mais de 10 minutos
        refetchOnWindowFocus: true, // não busca no windows focus
        refetchOnReconnect: true, // não busca no reconnect
        refetchOnMount: true, // não busca no mount
        retry: false, // não tenta novamente em caso de erro
        enabled: true, // habilita a query
    });
    return { user: data, error, loadingUser: isLoading, refetchUser: refetch };
}
// hook para logout
export function useLogout() {
  const { setDados } = React.useContext(DadosContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/users/logout");
      return data;
    },
    onSuccess: () => {
      // Zera os dados da query
      queryClient.setQueryData(["refreshUser"], null);

      // ou, se quiser remover completamente:
      // queryClient.removeQueries({ queryKey: ["refreshUser"] });

      // Atualiza o contexto
      setDados(a => ({ ...a, logado: false }));
    },
  });
}
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
    const { data, error, isLoading,refetch } = useQuery({
        queryKey: ["usersSystem"],
        queryFn: async () => {
            const { data } = await api.get("/api/users");
            return data;
        },
        staleTime: 1000 * 60 * 5, // cache por 5 minutos
        gcTime: 1000 * 60 * 10, // não deixa a aplicação usar o cache por mais de 10 minutos
        refetchOnWindowFocus: true, // não busca no windows focus
        refetchOnReconnect: true, // não busca no reconnect
        refetchOnMount: true, // não busca no mount
        retry: true, // não tenta novamente em caso de erro
    });
    return { usersSystem: data, error, loadingUsersSystem: isLoading,refetchUsersSystem: refetch };
}




