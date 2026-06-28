import React from "react";
import AppBar from "../../components/AppBar/index.jsx";
import { Box, CssBaseline, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";





const Home = () => {
  const theme = useTheme();

  return (


    <>
      <CssBaseline />
      <Box variant="elevation"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: '100vh',
          minWidth: '100%',
          maxWidth: '100%',
          backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper
        }} >

        <AppBar />

        <Box sx={{ maxWidth: '100%', minWidth: '100%' }}>
          <Outlet />
        </Box>


      </Box>
    </>


  );
};

export default Home;