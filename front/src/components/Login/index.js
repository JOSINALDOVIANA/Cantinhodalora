import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar
} from "@mui/material";
import { DadosContext } from "../../routs.js";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { api } from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [Dados, setDados] = React.useContext(DadosContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (Dados.logado) {
      navigate("/");
    }
  }, [Dados.logado, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // bgcolor: "#f5f5f5"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3
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
          onChange={(e) => { setDados(a => ({ ...a, email: e.target.value })); }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => { setDados(a => ({ ...a, senha: e.target.value })); }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={async (e) => {
            e.preventDefault();
            await api.post("/api/users/login", { email: Dados.email, password: Dados.senha }).then((res) => {
              setDados(a => ({ ...a, email: "", senha: "", logado: true, user: res.data }));
              navigate("/minha-conta");
            }).catch((err) => {
              console.log(err);
              Swal.fire({
                title: "Erro",
                text: "Login ou senha inválidos!",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#050505",
              });

            });
          }}
        >
          Entrar
        </Button>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Esqueceu a senha?
        </Typography>
      </Paper>
    </Box>
  );
}
