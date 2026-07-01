import { Add, Delete, Edit, Visibility, VisibilityOff } from '@mui/icons-material';
import { Paper, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import React from 'react';
import { DadosContext } from '../../services/Contexts/DadosContext';
import { api } from '../../services/api';
import Swal from 'sweetalert2';

// import { Container } from './styles';

export default function Users() {
    const { Dados, setDados } = React.useContext(DadosContext);
    const [showPassword, setShowPassword] = React.useState(false);
    const outlinedPasswordId = React.useId();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <>
            <Paper sx={{ display: 'flex', flexDirection: 'column', flexFlow: 1, flex: 1 }} >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Gerenciar Usuários</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setDados({ ...Dados, upUser: false, newUser: { name: '', email: '', password: '', images: [], adm: false, others_info: {} } })
                            handleOpenDialog()
                        }}>
                        Novo Usuário
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{}}>
                                <TableCell>Imagem</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Senha</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Dados?.user?.usersSystem?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell >{<Avatar src={user.url || user?.iamges?.[0]?.url} sx={{ width: 80, height: 80 }} />}</TableCell>
                                    <TableCell >{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                            <InputLabel htmlFor={`${outlinedPasswordId}-input`} />
                                            <OutlinedInput
                                                value={user?.password}
                                                id={`${outlinedPasswordId}-input`}
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label={
                                                                showPassword ? 'hide the password' : 'display the password'
                                                            }
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button onClick={() => {
                                            setDados(a => ({ ...a, upUser: true, newUser: { ...user } }))
                                            handleOpenDialog()
                                        }} size="small" startIcon={<Edit />} sx={{ mr: 1 }}>
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => {
                                                api.delete(`api/users/${user.id}`).then(r => {
                                                    api.get('/api/users').then(r => {
                                                        setDados(a => ({ ...a, user: { ...a.user, usersSystem: [...r.data] } }))
                                                    })
                                                })
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
}
