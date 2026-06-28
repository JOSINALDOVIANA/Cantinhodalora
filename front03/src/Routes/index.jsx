import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { themeDarck, themeLight } from './../functions/theme.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



import { DadosProvider } from '../services/providers/DadosProvider.jsx';
import Load from './../pages/Load/index.jsx';
import { ColorModeContext } from '../services/Contexts/ColorContext.jsx';

const Home = React.lazy(() => import('./../pages/Home/Home.jsx'));
const Login = React.lazy(() => import('./../pages/Login/index.jsx'));
const Products = React.lazy(() => import('./../components/Grid/index.jsx'));
const MyAccount = React.lazy(() => import('./../pages/Profile/index.jsx'));
const Chat = React.lazy(() => import('./../pages/Chat/index.jsx'));

export default function Rotas() {
    const queryClient = new QueryClient();

    const [mode, setMode] = React.useState(() => {
        // return 'dark'
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark"
        } else {
            return "light"
        }
    });
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme(
                mode === 'dark' ? themeDarck : themeLight
            ),
        [mode],
    );

    return (
        <QueryClientProvider client={queryClient}>
            <DadosProvider>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <React.Suspense fallback={<Load />}>
                            <BrowserRouter >
                                <Routes>
                                    <Route path="/*" element={<Typography>DESCULPE!! este recuso esta indisponivel ou em desenvolvimento</Typography>} />
                                    {/* <Route path="/teste" element={<Teste />} /> */}
                                    <Route path="/" element={<Home />} >
                                        <Route index element={<Products />}></Route>
                                        <Route path="/login" element={<Login />}></Route>
                                        <Route path="/minha-conta" element={<MyAccount />}></Route>
                                        <Route path="/chat" element={<Chat />}></Route>
                                    </Route>
                                    {/* <Route path="/login" element={<Login />} /> */}
                                    {/* <Route path="/cadastro/cliente" element={<CadastroCliente />} /> */}
                                    {/* <Route path="/perfil" element={<Perfil />}>
                                            <Route index element={<Produtosedit />}></Route>
                                            <Route path="/perfil/inicio" element={<Produtosedit />}></Route>
                                            <Route path="/perfil/userEdit" element={<Useredit />}></Route>
                                            <Route path="/perfil/produtosedit" element={<Produtosedit />}></Route>
                                            <Route path="/perfil/produtoscad" element={<Produtoscad />}></Route>
                                            <Route path="/perfil/fecharCaixa" element={<Fcaixa />}></Route>
                                            <Route path="/perfil/relatorio" element={<Relatorios />}></Route>
                                            <Route path="/perfil/imagensclientes" element={<Imagenscli />}></Route>
                                            <Route path="/perfil/imagensprodutos" element={<Imagensprod />}></Route>
                                            <Route path="/perfil/promocoes" element={<Promo />}></Route>
                                            <Route path="/perfil/clientes" element={<ListaClientes />}></Route>
                                        </Route> */}
                                    {/* <Route path="/cliente" element={<TelaIncialCliente />} >
                                            <Route index element={<ClienteDados />}></Route>
                                            <Route path="/cliente/cadastro" element={<CadastroCliente />} />
                                          
                                        </Route> */}

                                </Routes>
                            </BrowserRouter>
                        </React.Suspense>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </DadosProvider>
        </QueryClientProvider>

    );
}