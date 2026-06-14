import React from "react";
import AppBar from "../../components/AppBar";
import { alpha, Box, Paper, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";





const Home = () => {
  const theme = useTheme();
  console.log()
  return (


    <Box variant="elevation" elevation={1} component={Paper} sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: '100vh',
      minWidth: '100%',
      maxWidth: '100%',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)}, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.dark, 0.25)})`,
    }} >

      <AppBar />
      <Box sx={{ maxWidth: '100%', minWidth: '100%' }}>
        <Outlet />
      </Box>


    </Box>


  );
};

export default Home;