import React, { useEffect, useState } from 'react'
import { getUserByEmail, isAdmin, isLogged, profile } from '../services/users.services'
import { useLocation } from 'react-router-dom';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useSnackbar } from 'notistack';
import { useDialogs } from '@toolpad/core';
import { deleteQuestionById, getAllQuestions, getQuestionsByUserId } from '../services/questions.services';


const QuestionsList = () => {

    const [user, setUser] = useState({});
    const [questions, setQuestions] = useState([]);
    const [areQuestions, setAreQuestions] = useState(false);

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

    //Recupera todas las preguntas y las asigna al estado questions
    const fetchAllQuestions = async () => {
        const response = await getAllQuestions();

        if (response.status !== 200) {
            return enqueueSnackbar('Error al obtener la lista de preguntas:\n' + response.data.data.error, { variant: 'error' });
        }

        setQuestions(response.data.data)
        setAreQuestions(true);
    };

    //Recupera todas las preguntas del usuario logado y los asigna al estado questions
    const fetchUserQuestions = async (userId) => {

        const response = await getQuestionsByUserId({ usuario_id: userId });

        if (response.status !== 200) {
            return enqueueSnackbar('Error al obtener el historial de preguntas:\n' + response.data.data.error, { variant: 'error' });
        }

        //Si recibo un array vacio como respuesta, muestro el mensaje de que no se han encontrado archivos
        if (response.data.data.length === 0) {
            return setAreQuestions(false);
        }

        setQuestions(response.data.data)
        setAreQuestions(true);
    };

    //Recupera las preguntas en función del rol y de la ruta para un renderizado condicional
    const fetchData = async () => {
        if (user?.id) {
            !isProfileRoute && isAdmin() ?
                fetchAllQuestions()
                :
                fetchUserQuestions(user.id)
        }
    }

    useEffect(() => {
        fetchData()
    }, [user]);

    // Función que elimina un registro de pregunta
    const onDeleteQuestion = async (questionId) => {
        if (!isLogged()) {
            return enqueueSnackbar('Debes estar logado para acceder a esta función', { variant: 'error' });
        }

        const drop = await dialogs.confirm('Vas a eliminar este registro. Estás segur@?', {
            title: '¡Cuidado!',
            okText: 'Si',
            cancelText: 'No',
        });

        if (drop) {
            // Eliminar registro
            const response = await deleteQuestionById({ id: questionId });
            if (response.status !== 200) {
                return enqueueSnackbar('Error al borrar el registro:\n' + response.data.data.error, { variant: 'error' });
            }

            enqueueSnackbar(response.data.data.msg, { variant: 'success' });
            // Vuelvo a cargar la lista de preguntas actualizada
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
                        minHeight: "100vh",
                        mt: { md: 1, xl: 5 }
                    }}>
                    <Box display='flex' justifyContent='space-between' width='100%'>
                        <Typography variant='h2' sx={{ mb: 2 }}>Lista de todas las preguntas realizadas</Typography>
                    </Box>
                    {areQuestions
                        ?
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead  >
                                    <TableRow>
                                        <TableCell>Pregunta</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questions?.map((question, index) => {
                                        return (
                                            <TableRow key={question.id || index}>
                                                <TableCell component="th" scope="row">
                                                    {question.pregunta}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                        {/* Texto de ayuda para accesibilidad */}
                                                        <Tooltip title="Eliminar" enterDelay={1000} arrow>
                                                            <Button onClick={() => onDeleteQuestion(question.id)}>
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
                        <Typography variant="h2">No se han realizado preguntas.</Typography>
                    }
                </Container>
                :
                <Box width='100%' maxWidth={550}>
                    <Box mb={5}>
                        <Box display='flex' justifyContent='space-between' width='100%'>
                            <Typography variant='h3' sx={{ mb: 2 }}>Historial de preguntas</Typography>
                        </Box>
                        {/* } */}
                        {areQuestions
                            ?
                            <TableContainer component={Paper}>
                                <Table aria-label="customized table">
                                    <TableHead  >
                                        <TableRow>
                                            <TableCell>Pregunta</TableCell>
                                            <TableCell align="right" sx={{ pr: 3 }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {questions?.map((question, index) => {
                                            return (
                                                <TableRow key={question.id || index}>
                                                    <TableCell component="th" scope="row">
                                                        {question.pregunta}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                                            {/* Texto de ayuda para accesibilidad */}
                                                            <Tooltip title="Eliminar" enterDelay={1000} arrow>
                                                                <Button onClick={() => onDeleteQuestion(question.id)}>
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
                            <Typography variant="h4">No se han realizado preguntas.</Typography>
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default QuestionsList;