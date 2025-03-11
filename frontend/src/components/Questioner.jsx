import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getUserByEmail, isLogged, profile } from "../services/users.services";
import { Link, useNavigate } from "react-router-dom";
import { insertDocument } from "../services/documents.services";
import { useEffect, useState } from "react";

const Questioner = () => {

    const [answer, setAnswer] = useState("Respuesta de FileGPT sobre tu archivo subido...");
    const [user, setUser] = useState({});

    // Hook para el formulario
    const { register, handleSubmit, formState, watch, reset } = useForm();
    const { errors } = formState;

    // Hook de navegación
    const navigate = useNavigate();

    //Hook para los alert 
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

    const sendForm = async (values) => {
        console.log(values);

        //Obtendo los datos del arhivo para pasarle el id a insert question


        // Llamo a la ruta insertQuestion




        // Envio la pregunta al backend
        // const response = await ask({ pregunta: values.question });

        // if (response.status !== 200) {
        //     return enqueueSnackbar('Error al procesar la pregunta:\n' + response.data.data.error, { variant: 'error' });
        // }

        reset();

        // Respuesta del bot
        // setAnswer(response.data.data)
        setAnswer(values.question)
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                mt: { md: 3, lg: 3, xl: 5 }
            }}>
            <Box
                sx={{
                    width: { md: isLogged() ? "60%" : "80%" },
                    placeItems: "center",
                    p: 3,
                    pb: 6,
                    mt: 3,
                    bgcolor: 'lightskyblue',
                    border: 3,
                    borderColor: '#0ff',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h2" sx={{ my: 2, mb: 3 }
                }>Pregúntame algo sobre tu archivo</Typography >
                <Box component="form" sx={{ display: 'flex', width: '90%', flexDirection: 'column', gap: 15 }} onSubmit={handleSubmit(sendForm)}>
                    <Stack direction="row" justifyContent={'space-between'} display='flex' width='100%' gap={2} my={3}>
                        <TextField
                            type='text'
                            {...register("question", {
                                required: "Haz una pregunta..."
                            })}
                            error={!!errors.question}
                            helperText={errors.question?.message}
                            sx={{ width: '100%', minWidth: 100 }}
                        />
                        <Button
                            sx={{ maxHeight: 55 }}
                            variant="contained"
                            type="submit">
                            Enviar
                        </Button>
                    </Stack>
                </Box >
                <Box sx={{ p: 3, backgroundColor: 'darkblue', borderRadius: 5, color: '#fff', width: '95%' }}>
                    <Typography variant="body1" fontSize={18}>{answer}</Typography>
                </Box>
            </Box>
        </Container>

    );
};

export default Questioner;
