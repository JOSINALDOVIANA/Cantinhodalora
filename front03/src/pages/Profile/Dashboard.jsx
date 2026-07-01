import React from 'react';
import { useRefreshUser } from '../../services/UseQuery/UsersQuery';
import { DadosContext } from '../../services/Contexts/DadosContext';
import { blue, deepOrange, green, purple } from '@mui/material/colors';
import { Box, Card, CardContent, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { useLoadProducts } from '../../services/UseQuery/ProductsQuery';
import { useFetchUsersSystem } from '../../services/UseQuery/UsersQuery';
// import { Container } from './styles';

export default function Dashboard() {
    const { user, loadingUser, error } = useRefreshUser();
    const { usersSystem, loadingUsersSystem, errorUsersSystem } = useFetchUsersSystem();
    const { products } = useLoadProducts();
    const { Dados, setDados } = React.useContext(DadosContext);

    const theme = useTheme();
    const totalUsers = usersSystem?.length || 0;
    const activeUsers = usersSystem?.filter((u) => u?.status == true).length || 0;
    const adminUsers = usersSystem?.filter((u) => u?.adm == true).length || 0;
    const totalProducts = products?.length || 0;
    const getPercent = (value, total) => total > 0 ? Math.round((value / total) * 100) : 0;

    const dashboardCards = [
        {
            title: 'Usuários',
            value: totalUsers,
            subtitle: 'Total de usuários cadastrados',
            percent: getPercent(totalUsers, totalUsers), // Sempre 100% para o total
            color: green[500],
        },
        {
            title: 'Ativos',
            value: activeUsers,
            subtitle: 'Usuários com status ativo',
            percent: getPercent(activeUsers, totalUsers),
            color: blue[500],
        },
        {
            title: 'Administradores',
            value: adminUsers,
            subtitle: 'Contagem de administradores',
            percent: getPercent(adminUsers, totalUsers),
            color: purple[500],
        },
        {
            title: 'Produtos',
            value: totalProducts,
            subtitle: 'Produtos cadastrados',
            percent: totalProducts > 0 ? 100 : 0,
            color: deepOrange[500],
        },
    ];

    const renderDashboardCard = ({ title, value, subtitle, percent, color }) => (
        <Grid xs={12} sm={6} md={4} key={title}>
            <Card sx={{
                minHeight: 220,
                minWidth: 220,
                maxWidth: 220,
                maxHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.grey[50],
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[1],
            }}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    height: '100%',
                    width: '100%',
                }}>
                    <Typography color="textSecondary" gutterBottom sx={{ letterSpacing: 0.5 }}>
                        {title}
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            variant="determinate"
                            value={percent}
                            size={120}
                            thickness={5}
                            sx={{ color, opacity: 0.2 }}
                        />
                        <CircularProgress
                            variant="determinate"
                            value={percent}
                            size={120}
                            thickness={5}
                            sx={{
                                color,
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                transform: 'rotate(-90deg)',
                            }}
                        />
                        <Box sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {value}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {percent}%
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );


    return (
        <>
            <Grid sx={{ justifyContent: 'center', alignItems: 'center', padding: 2 }} container spacing={3}>
                {dashboardCards.map(renderDashboardCard)}
            </Grid>

        </>
    );
}
