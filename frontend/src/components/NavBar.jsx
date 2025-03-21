import { AppBar, Box, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuRounded";
import { useDialogs } from "@toolpad/core";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAdmin, isLogged } from "../services/users.services";

const NavBar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);  // Estado para el menú lateral

    // Hook de navegación
    const navigate = useNavigate();

    // Hook para los confirm
    const dialogs = useDialogs();

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

    // Función que alterna el estado del menú lateral en móviles y/o pantallas grandes
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Contenido del menú para pantallas grandes
    const menuItems = (
        <>
            <Button color="inherit" component={Link} to="/">
                Inicio
            </Button>
            {isAdmin() && (
                <Box sx={{ p: 0.3, border: 2, borderRadius: 1 }}>
                    <Button color="inherit" component={Link} to="/admin/users">
                        Usuarios
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/documents">
                        Archivos
                    </Button>
                    <Button color="inherit" component={Link} to="/admin/questions">
                        Preguntas
                    </Button>
                </Box>
            )}
            {
                isLogged() ? (
                    <>
                        <Button color="inherit" component={Link} to="/questioner">
                            Preguntar
                        </Button>
                        <Button color="inherit" component={Link} to="/file-upload">
                            Subir Archivo
                        </Button>
                        <Button color="inherit" component={Link} to="/profile">
                            Mi perfil
                        </Button>
                        <Button onClick={onLogout} sx={{ textAlign: 'center', bgcolor: 'lightgrey' }}>
                            Cerrar Sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/register">
                            Registro
                        </Button>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    </>
                )
            }
        </>
    );

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor: 'deepskyblue', padding: { xs: "6px 12px", md: "8px 16px" } }}>

                {/* Logo y Nombre */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        component="img"
                        alt="logo"
                        src="/inteligencia-artificial.png"
                        sx={{ width: { xxs: 40, sm: 50 }, maxWidth: 50 }}
                    />
                    <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 'bold' }}>
                        FileGPT
                    </Typography>
                </Box>

                {/* Menú en pantallas grandes */}
                <Box sx={{ display: { xxs: "none", bg: "flex" }, gap: 1 }}>
                    {menuItems}
                </Box>

                {/* Icono de Menú en móviles */}
                <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { xxs: "flex", bg: "none" } }}>
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
                <List sx={{ color: 'darkblue', bgcolor: 'white' }}>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/" onClick={handleDrawerToggle}>
                            <ListItemText primary="Inicio" />
                        </ListItemButton>
                    </ListItem>
                    {isAdmin() && (
                        <Box sx={{ p: 0.3, border: 2, borderRadius: 1 }}>
                            <Typography sx={{ fontSize: 12, textAlign: 'center', backgroundColor: 'lightblue' }}>Opciones de administrador</Typography>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admin/users" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Usuarios" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admin/documents" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Archivos" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admin/questions" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Preguntas" />
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    )}
                    {isLogged() ? (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/questioner" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Preguntar" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/file-upload" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Subir Archivo" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/profile" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Mi perfil" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding sx={{ bgcolor: 'darkblue', color: 'white' }}>
                                <ListItemButton onClick={() => { handleDrawerToggle(); onLogout(); }}>
                                    <ListItemText primary="Cerrar Sesión" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to="/register" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Registro" />
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
        </AppBar >
    );
};

export default NavBar;
