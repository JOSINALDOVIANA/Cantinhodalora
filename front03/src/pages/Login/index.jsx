import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { DadosContext } from "../../services/Contexts/DadosContext.jsx";
import { api } from "../../services/api.jsx";
import Swal from "sweetalert2";
import { useRefreshUser, useLogin } from "../../services/UseQuery/UsersQuery.jsx";

export default function LoginPage() {
  const { Dados, setDados } = React.useContext(DadosContext);
  const { user, loadingUser } = useRefreshUser();
  const loginMutation = useLogin();
  const navigate = useNavigate();


//  console.log("user", user)
  React.useEffect(() => {

    if (Dados?.logado) {
      navigate("/minha-conta");
    }
  }, [Dados?.logado, navigate]);


  return (
    <>
      {loadingUser && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}
      {!loadingUser && <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Paper
          component="form"
          onSubmit={async (e) => {
            e.preventDefault();
            await loginMutation.mutateAsync({
              email: Dados.email,
              password: Dados.password,
            });


          }}
          elevation={6}
          sx={{
            p: 4,
            width: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => {
              setDados((a) => ({ ...a, email: e.target.value }));
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => {
              setDados((a) => ({ ...a, password: e.target.value }));
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
            type="submit"
          >
            Entrar
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Esqueceu a senha?
          </Typography>
        </Paper>
      </Box>}
    </>
  );
}
