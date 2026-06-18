export const themeLight = {
  palette: {
    primary: {
      main: '#207e09'
    },
    secondary: {
      main: '#1bf16d'
    },
    action: {
      active: '#ffffff',   // cor padrão dos ícones
      disabled: '#999999', // cor quando desabilitado
    },
    background: {
      // default: '#fcfbfe',
      // paper: 'rgb(252, 252, 254)'
    },
    text: {
      primary: '#f5e0e0ff',   // cor padrão dos textos
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
    },
    //  MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       color:"#0000",
    //       backgroundColor: '#4caf50', // cor customizada do AppBar
    //     },
    //   },
    // },
  }
};
export const themeDarck = {
  palette: {
    primary: {
      main: '#c48212ff',
      dark: '#583e05ff',
      light: '#ddc687ff'
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
  components: {
    // MuiAppBar: {
    //   styleOverrides: {
    //     root: {
    //       // backgroundColor: '#4caf50', // cor customizada do AppBar
    //     },
    //   },
    // },
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
