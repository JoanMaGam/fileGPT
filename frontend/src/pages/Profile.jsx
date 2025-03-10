import React, { useEffect, useState } from 'react'
import { getUserByEmail, profile } from '../services/users.services'
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import DocumentsList from './DocumentsList';
import QuestionsList from './QuestionsList';


const Profile = () => {

    const [user, setUser] = useState({})
    const [rol, setRol] = useState('')

    //Hooks para los alert y los confirm
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Recupero el usuario de la BD y lo asigno al estado user. 
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

    useEffect(() => {
        //Compruebo el rol de usuario y modifico el estado 'rol' para que se muestre el correspondiente en tipo texto.
        if (user.rol_id === 1) {
            setRol('Root')
        } else {
            setRol('Usuario')
        }
    }, [user])

    return (
        <Box>
            <Container sx={{
                maxWidth: "lg",
                display: "flex",
                flexDirection: 'column',
                alignItems: "baseline",
                mt: { xs: 1, sm: 2, xl: 5 }
            }}>
                <Typography variant='h2' sx={{ mb: 2 }}>Mi perfil</Typography>
                <TableContainer component={Paper} sx={{ minWidth: 50, maxWidth: 550, mt: 1 }} >
                    <Table aria-label="customized table">
                        <TableBody>
                            <TableRow >
                                <TableCell component="th" variant='head' scope="row">
                                    Nombre
                                </TableCell>
                                <TableCell align="right">
                                    {user?.nombre}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell component="th" variant='head' scope="row">
                                    Apellido/s
                                </TableCell>
                                <TableCell align="right">
                                    {user?.apellidos}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell component="th" variant='head' scope="row">
                                    Email
                                </TableCell>
                                <TableCell align="right">
                                    {user?.email}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell component="th" variant='head' scope="row">
                                    Rol
                                </TableCell>
                                <TableCell align="right">
                                    {rol}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Lista de documentos subidos del usuario */}
                <DocumentsList />
                {/* Historial de preguntas del usuario */}
                <QuestionsList />
            </Container>
        </Box >
    )
}

export default Profile