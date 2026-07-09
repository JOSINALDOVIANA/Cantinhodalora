import React from "react";
import { DadosContext } from "../../services/Contexts/DadosContext";
import { useTheme } from "@emotion/react";
import { ListItem, ListItemIcon, ListItemText} from "@mui/material";
import { Category, Dashboard, ImageAspectRatio, List, People, Wifi2Bar } from "@mui/icons-material";

export default function ListItensMenu({ color }) {
    const { Dados,setDados } = React.useContext(DadosContext);
    const theme = useTheme();
    
    return (
        <>
        {/* Dashboard */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer'}}

                selected={Dados?.activeTabPerfil === 'dashboard'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'dashboard' })}
              >
                <ListItemIcon sx={{ color: color }}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

            }

            {/* User */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem

                selected={Dados?.activeTabPerfil === 'users'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'users' })}
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}
              >
                <ListItemIcon sx={{ color: color }}>
                  <People  />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItem>
            }

            {/* Categorias */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem
                selected={Dados?.activeTabPerfil === 'Categories'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'Categories' })}
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}
              >
                <ListItemIcon sx={{ color: color }}>
                  <Category  />
                </ListItemIcon>
                <ListItemText primary="Categorias" />
              </ListItem>
            }
            {/* wifi */}
            {Dados?.logado  && window.location.pathname === '/minha-conta' &&
              <ListItem
                selected={Dados?.activeTabPerfil === 'WifiConfigs'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'WifiConfigs' })}
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}
              >
                <ListItemIcon sx={{ color: color }} >
                  <Wifi2Bar  />
                </ListItemIcon>
                <ListItemText primary="Wi-Fi" />
              </ListItem>
            }

            {/* Produtos */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}
                selected={Dados?.activeTabPerfil === 'products'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'products' })}
              >
                <ListItemIcon sx={{ color: color }}>
                  <List />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
              </ListItem>
            }



            {/* Images */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}

                selected={Dados?.activeTabPerfil === 'images'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'images' })}
              >
                <ListItemIcon sx={{ color: color }}>
                  <ImageAspectRatio />
                </ListItemIcon>
                <ListItemText primary="Imagens/Produtos" />
              </ListItem>
            }
            {/* Images/users */}
            {Dados?.logado && window.location.pathname === '/minha-conta' &&
              <ListItem
                sx={{  mb: 1, borderRadius: 2,cursor:'pointer' }}

                selected={Dados?.activeTabPerfil === 'images_user'}
                onClick={() => setDados({ ...Dados, activeTabPerfil: 'images_user' })}
              >
                <ListItemIcon sx={{ color: color }}>
                  <ImageAspectRatio />
                </ListItemIcon>
                <ListItemText primary="Imagens/Users" />
              </ListItem>
            }
        </>
    )
}