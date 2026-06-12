import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { IconButton, Typography } from '@mui/material';
import { Brightness6, Brightness7 } from '@mui/icons-material';


import App from './App.js'
import Load from './components/load';
import { themeDarck, themeLight } from './functions/theme/theme.js';
const ProductGrid = React.lazy(() => import('./components/card/grid.js'));
const Login = React.lazy(() => import('./components/Login/index.js'));
// const Teste = React.lazy(() => import('./functions/teste/index.js'));
const MinhaConta = React.lazy(() => import('./components/user/perfil.js'));
const Chat = React.lazy(() => import('./components/Chat/index.js'));






export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });
export let SearchContex = React.createContext(null);
export let DadosContext = React.createContext(null);

export function TrocarTheme(props) {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (


        <IconButton {...props} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness6 /> : <Brightness7 />}
        </IconButton>

    );
}

export function Rotas() {
    const [search, setSearch] = React.useState("")
    const [Dados, setDados] = React.useState({ logado: false, activeTabPerfil: "", user: {} });
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
                mode==='dark'?themeDarck:themeLight
            ),
        [mode],
    );

    return (
        <DadosContext.Provider value={[Dados, setDados]}>
            <SearchContex.Provider value={[search, setSearch]}>
                <ColorModeContext.Provider value={colorMode}>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                    <ThemeProvider theme={theme}>
                        <React.Suspense fallback={<Load />}>

                            <BrowserRouter >

                                <Routes>
                                    <Route path="/*" element={<Typography>DESCULPE!! este recuso esta indisponivel ou em desenvolvimento</Typography>} />
                                    {/* <Route path="/teste" element={<Teste />} /> */}
                                    <Route path="/" element={<App />} >
                                        <Route index element={<ProductGrid />}></Route>
                                        <Route path="/login" element={<Login />}></Route>
                                        <Route path="/minha-conta" element={<MinhaConta />}></Route>
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
                    {/* </LocalizationProvider> */}

                </ColorModeContext.Provider>
            </SearchContex.Provider>
        </DadosContext.Provider>
    );
}