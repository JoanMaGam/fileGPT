import { AppBar, Box, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuRounded";
import { useDialogs } from "@toolpad/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAdmin, isLogged } from "../services/users.services";
import logo from '../assets/img/inteligencia-artificial.png';

const NavBar = () => {
    const [role, setRole] = useState(2);
    const [mobileOpen, setMobileOpen] = useState(false);  // Estado para el menú lateral
    const navigate = useNavigate();

    // Hook para los confirm
    const dialogs = useDialogs();

    useEffect(() => {
        // Recupero el rol del usuario logado y lo asigno al estado role. 
        const getRole = async () => {
            const response = await profile();
            if (response.status !== 200) {
                return enqueueSnackbar('Error al obtener el perfil de usuario:\n' + response.data.data.error, { variant: 'error' });
            }
            setRole(response.data.user.rol_id);
        };
        // getRole();
    }, []);

    // Función que cierra la sesión del usuario
    const onLogout = async () => {
        const drop = await dialogs.confirm('Vas a cerrar tu sesión. Estás segur@?', {
            title: '¡Aviso!',
            okText: 'Si',
            cancelText: 'No',
        });
        if (drop) {
            localStorage.removeItem('userLogged_token');
            navigate('/login');
        };
    };

    // Alternar el estado del menú lateral en móviles
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Contenido del menú (mismo para escritorio y móvil)
    const menuItems = (
        <>
            {!isAdmin() && (
                <>
                    <Button color="inherit" component={Link} to="/profile">
                        Mi perfil
                    </Button>
                    <Button color="inherit" component={Link} to="/usersList">
                        Lista de usuarios
                    </Button>
                </>
            )}
            {isLogged() ? (
                <Button onClick={onLogout} sx={{ textAlign: 'center', bgcolor: 'lightgrey' }}>
                    Cerrar Sesión
                </Button>
            ) : (
                <>
                    <Button color="inherit" component={Link} to="/register">
                        Register
                    </Button>
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                </>
            )}
        </>
    );

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor: 'deepskyblue' }}>

                {/* Logo y Nombre */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        component="img"
                        alt="logo"
                        src={logo}
                        sx={{ width: { xs: 40, sm: 50 } }}
                    />
                    <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 'bold' }}>
                        FileGPT
                    </Typography>
                </Box>

                {/* Menú en pantallas grandes */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    {menuItems}
                </Box>

                {/* Icono de Menú en móviles */}
                <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { xs: "flex", md: "none" } }}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Menú lateral para móviles */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    "& .MuiDrawer-paper": { width: 250 }
                }}
            >
                <List>
                    {!isAdmin() && (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/profile" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Mi perfil" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/usersList" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Lista de usuarios" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                    {isLogged() ? (
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { handleDrawerToggle(); onLogout(); }}>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/register" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Register" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/login" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
        </AppBar>
    );
};

export default NavBar;
