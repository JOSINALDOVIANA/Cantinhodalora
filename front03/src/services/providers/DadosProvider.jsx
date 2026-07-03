import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DadosContext } from '../Contexts/DadosContext.jsx';

export function DadosProvider({ children }) {
    const [Dados, setDados] = useState({
        productsSearch: [],
        logado: false,
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


