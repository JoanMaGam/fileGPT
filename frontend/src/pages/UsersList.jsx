import React, { useEffect, useState } from 'react'
import { deleteUserByEmail, getUserByEmail, getUsers, isLogged, profile } from '../services/users.services'
import { Link } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';

import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';
import { useDialogs } from '@toolpad/core';


const UsersList = () => {

    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [areUsers, setAreUsers] = useState(false);

    //Hooks para los alert y los confirm
    const { enqueueSnackbar } = useSnackbar();
    const dialogs = useDialogs();

    //Recupera todos los usuarios y los asigna al estado users
    const fetchData = async () => {
        const response = await getUsers();

        if (response.status !== 200) {
            return enqueueSnackbar('Error al obtener la lista de usuarios:\n' + response.data.data.error, { variant: 'error' });
        }

        setUsers(response.data.data)
        setAreUsers(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Recupero el usuario logado y lo asigno al estado user
        const getProfile = async () => {
            const response = await profile();

            if (response.status !== 200) {
                return enqueueSnackbar('Error al obtener el perfil de usuario:\n' + response.data.fatal, { variant: 'error' });
            }

            const response2 = await getUserByEmail({ email: response.data.user.user_email });

            if (response2.status !== 200) {
                return enqueueSnackbar('Error al obtener el usuario:\n' + response2.data.data.error, { variant: 'error' });
            }
            const userByEmail = response2.data.data;
            setUser(userByEmail);
        }
        getProfile();
    }, []);

    // Función que elimina un usuario por email
    const onDeleteUser = async (userParam) => {
        if (!isLogged()) {
            return enqueueSnackbar('Debes estar logado para acceder a esta función', { variant: 'error' });
        }

        const drop = await dialogs.confirm('Vas a eliminar el usuario. Estás segur@?', {
            title: '¡Cuidado!',
            okText: 'Si',
            cancelText: 'No',
        });

        if (drop) {
            //Verifico que el usuario no se pueda eliminar a si mismo
            if (userParam.email === user.email) {
                return enqueueSnackbar('No te puedes eliminar a ti mismo', { variant: 'error' });
            }

            // Eliminar usuario
            const response = await deleteUserByEmail({ email: userParam.email });
            if (response.status !== 200) {
                return enqueueSnackbar('Error al borrar usuario por email:\n' + response.data.data.error, { variant: 'error' });
            }

            enqueueSnackbar(response.data.data.msg, { variant: 'success' });
            // Vuelvo a cargar la lista de usuarios actualizada
            fetchData();
        }
    }


    return (
        <Box>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "baseline",
                    minHeight: "100vh",
                    mt: { md: 1, xl: 5 }
                }}>
                <Box display='flex' justifyContent='space-between' width='100%'>
                    <Typography variant='h2' sx={{ mb: 2 }}>Lista de Usuarios</Typography>
                    <Link to={'/admin/addUser'}>
                        <Button variant='contained'>Añadir Usuario</Button>
                    </Link>
                </Box>
                {areUsers
                    ?
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead  >
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell align="left">Apellidos</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Rol</TableCell>
                                    <TableCell align="right" sx={{ pr: 6 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.map((user, index) => {
                                    return (
                                        <TableRow key={user.email || index}>
                                            <TableCell component="th" scope="row">
                                                {user.nombre}
                                            </TableCell>
                                            <TableCell align="left">{user.apellidos}</TableCell>
                                            <TableCell align="left">{user.email}</TableCell>
                                            <TableCell align="left">{user.rol_id === 1 ? "Admin" : "Usuario"}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                    <Link to={`/admin/editUser`} state={{ usuario: user }}>
                                                        <Tooltip title="Editar" enterDelay={1000} arrow>
                                                            <Button>
                                                                <BorderColorRoundedIcon />
                                                            </Button>
                                                        </Tooltip>
                                                    </Link>
                                                    <Tooltip title="Eliminar" enterDelay={1000} arrow>
                                                        <Button onClick={() => onDeleteUser(user)}>
                                                            <DeleteRoundedIcon />
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    <Typography variant="h2">No se han encontrado usuarios</Typography>
                }
            </Container>
        </Box>
    )
}

export default UsersList