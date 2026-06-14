export const themeLight={
  palette: {
    primary: {
      main: '#207e09'
    },
    secondary: {
      main: '#1bf16d'
    },
    action: {
    active: '#f4f5f3',   // cor padrão dos ícones
    disabled: '#999999', // cor quando desabilitado
  },
    background: {
      default: '#fcfbfe',
      paper: 'rgb(252, 252, 254)'
    },
    text: {
      primary: '#333333',   // cor padrão dos textos
      secondary: '#555555'  // cor secundária
    },
    mode: 'light'
  },
  typography: {
    fontSize: 13,
    fontFamily: 'Roboto, Arial, sans-serif',
    allVariants: {
      color: '#333333' // força todos os textos a usar essa cor
    }
  },
  shape: {
    borderRadius: 5
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // remove letras maiúsculas automáticas
          fontWeight: 600,
          borderRadius: 8,
          padding: '6px 16px'
        },
        containedPrimary: {
          backgroundColor: '#285007',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1e3a05'
          }
        },
        containedSecondary: {
          backgroundColor: '#d6ed2c',
          color: '#000',
          '&:hover': {
            backgroundColor: '#c0d926'
          }
        }
      }
    }
  }
};
export const themeDarck={
    palette: {
        primary: {
            main: '#ee59c3'
        },
        secondary: {
            main: '#612be9'
        },
        mode: 'dark',
        background: {
            default: '#08040b',
            paper: '#08040b'
        }
    },
    typography: {
        fontFamily: 'Roboto',
        fontSize: 13
    },
    spacing: 7,
    shape: {
        borderRadius: 5
    },
    shadows: [
        'none',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]
}
