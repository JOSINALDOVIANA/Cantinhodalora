import React, { useContext } from "react";
import { useTheme } from "@emotion/react";
import { IconButton } from "@mui/material";
import { Brightness6, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../../services/Contexts/ColorContext.jsx";



export function TrocarTheme(props) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    return (


        <IconButton {...props} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness6 /> : <Brightness7 />}
        </IconButton>

    );
}