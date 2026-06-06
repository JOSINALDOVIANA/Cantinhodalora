import React from "react";
import PrimarySearchAppBar from "./components/AppBar";
import { alpha, Box, Paper, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";




const App = () => {
const theme = useTheme();
  return (


    <Box variant="elevation" elevation={1} component={Paper} sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: '100vh',
      minWidth: '100%',
      maxWidth: '100%',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
       }} >

      <PrimarySearchAppBar />
      
      {/* <AppBar/> */}
     <Box sx={{ maxWidth:'100%',minWidth: '100%' }}>
       <Outlet />
     </Box>


    </Box>


  );
};

export default App;