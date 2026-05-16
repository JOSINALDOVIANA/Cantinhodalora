import React from "react";
import PrimarySearchAppBar from "./components/AppBar";
import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";



const App = () => {

  return (


    <Box variant="elevation" elevation={1} component={Paper} sx={{ pt: 9, display: "flex", flexDirection: "column", minHeight: '100vh' }} >

      <PrimarySearchAppBar />
      <Outlet />


    </Box>


  );
};

export default App;