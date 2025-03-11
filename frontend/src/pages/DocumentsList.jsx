import React, { useEffect, useState } from 'react'
import { getUserByEmail, isAdmin, isLogged, profile } from '../services/users.services'
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';
import { useDialogs } from '@toolpad/core';
import { deleteDocumentById, getAllDocuments, getDocumentsByUserId } from '../services/documents.services';


const DocumentsList = () => {

    const [user, setUser] = useState({});
    const [documents, setDocuments] = useState([]);
    const [areDocuments, setAreDocuments] = useState(false);

    //Hooks para los alert y los confirm
    const { enqueueSnackbar } = useSnackbar();
    const dialogs = useDialogs();

    // Hook para obtener la ruta actual y comparar si es '/profile' para renderización condicional
    const location = useLocation();
    const isProfileRoute = location.pathname === '/profile';

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

    //Recupera todos los registros de documentos y los asigna al estado documents
    const fetchAllDocuments = async () => {
        const response = await getAllDocuments();

        if (response.status !== 200) {
            return enqueueSnackbar('Error al obtener la lista de archivos:\n' + response.data.data.error, { variant: 'error' });
        }

        setDocuments(response.data.data)
        setAreDocuments(true);
    };

    //Recupera todos los registros de documentos del usuario logado y los asigna al estado documents
    const fetchUserDocuments = async (userId) => {

        const response = await getDocumentsByUserId({ usuario_id: userId });

        if (response.status !== 200) {
            return enqueueSnackbar('Error al obtener la lista de archivos:\n' + response.data.data.error, { variant: 'error' });
        }

        //Si recibo un array vacio como respuesta, muestro el mensaje de que no se han encontrado archivos
        if (response.data.data.length === 0) {
            return setAreDocuments(false);
        }

        setDocuments(response.data.data)
        setAreDocuments(true);
    };

    //Recupera los registros de documentos en función del rol y de la ruta para un renderizado condicional
    const fetchData = async () => {
        if (user?.id) {
            !isProfileRoute && isAdmin() ?
                fetchAllDocuments()
                :
                fetchUserDocuments(user.id)
        }
    }

    useEffect(() => {
        fetchData()
    }, [user]);

    // Función que elimina un documento
    const onDeleteDocument = async (docId) => {
        if (!isLogged()) {
            return enqueueSnackbar('Debes estar logado para acceder a esta función', { variant: 'error' });
        }

        const drop = await dialogs.confirm('Vas a eliminar el archivo. Estás segur@?', {
            title: '¡Cuidado!',
            okText: 'Si',
            cancelText: 'No',
        });

        if (drop) {
            // Eliminar documento
            const response = await deleteDocumentById({ id: docId });
            if (response.status !== 200) {
                return enqueueSnackbar('Error al borrar el archivo:\n' + response.data.data.error, { variant: 'error' });
            }

            enqueueSnackbar(response.data.data.msg, { variant: 'success' });
            // Vuelvo a cargar la lista de documentos actualizada
            fetchData();
        }
    }

    return (
        <Box width='100%'>
            {!isProfileRoute
                ?
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        flexDirection: 'column',
                        alignItems: "baseline",
                        mt: { md: 1, xl: 5 }
                    }}>
                    <Box display='flex' justifyContent='space-between' width='100%'>
                        <Typography variant='h2' sx={{ mb: 2 }}>Lista de todos los Archivos subidos</Typography>
                        <Link to={'/admin/documents/add-file'}>
                            <Button variant='contained'>Añadir Archivo</Button>
                        </Link>
                    </Box>
                    {areDocuments
                        ?
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead  >
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {documents?.map((document, index) => {
                                        return (
                                            <TableRow key={document.id || index}>
                                                <TableCell component="th" scope="row">
                                                    {document.nombre_archivo}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                        {/* Texto de ayuda para accesibilidad */}
                                                        <Tooltip title="Eliminar" enterDelay={1000} arrow>
                                                            <Button onClick={() => onDeleteDocument(document.id)}>
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
                        <Typography variant="h2">No se han encontrado archivos.</Typography>
                    }
                </Container>
                :
                <Box width='100%' maxWidth={550}>
                    <Box sx={{ my: 5 }}>
                        <Box display='flex' justifyContent='space-between' width='100%'>
                            <Typography variant='h3' sx={{ mb: 2 }}>Mis archivos</Typography>
                        </Box>
                        {areDocuments
                            ?
                            <TableContainer component={Paper}>
                                <Table aria-label="customized table">
                                    <TableHead  >
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell align="right" sx={{ pr: 3 }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documents?.map((document, index) => {
                                            return (
                                                <TableRow key={document.id || index}>
                                                    <TableCell component="th" scope="row">
                                                        {document.nombre_archivo}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                            {/* Texto de ayuda para accesibilidad */}
                                                            <Tooltip title="Eliminar" enterDelay={1000} arrow>
                                                                <Button onClick={() => onDeleteDocument(document.id)}>
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
                            <Typography variant="h4">No se han encontrado archivos.</Typography>
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default DocumentsList;