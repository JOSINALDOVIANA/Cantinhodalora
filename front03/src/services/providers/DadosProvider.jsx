import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DadosContext } from '../Contexts/DadosContext.jsx';
import { lighten } from '@mui/material';

export function DadosProvider({ children }) {
    const [Dados, setDados] = useState({
        productsSearch: [],
        logado: false,
        mode:"light",
    });
    const value = {
        Dados,
        setDados,       

    };

    return (
        <DadosContext.Provider value={value}>
            {children}
        </DadosContext.Provider>
    );
}


