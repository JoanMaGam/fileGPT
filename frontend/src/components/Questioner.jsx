import { Box, Button, Container, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getUserByEmail, isLogged, profile } from "../services/users.services";
import { useLocation } from "react-router-dom";
import { getDocumentsByUserId } from "../services/documents.services";
import { useEffect, useState } from "react";
import { askAi } from "../services/ai.services";
import { insertQuestion } from "../services/questions.services";

const Questioner = () => {

    const [answer, setAnswer] = useState("Respuesta de FileGPT sobre tu archivo subido...");
    const [user, setUser] = useState({});
    const [userDocuments, setUserDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hook para el formulario
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Hook para obtener datos de otra ruta a traves de navigate()
    const location = useLocation();

    //Obtengo los datos del archivo para renderizado condicional
    const fileUploaded = location.state?.fileUploaded;

    // Función que obtiene los documentos del usuario logado y los asigna al estado userDocuments
    const getUserDocuments = async (user) => {
        try {
            const response = await getDocumentsByUserId({ usuario_id: user.id });

            if (response.status !== 200) {
                return enqueueSnackbar('Error al obtener los documentos del usuario:\n' + response.data.data.error, { variant: 'error' });
            }

            setUserDocuments(response.data.data);
        } catch (error) {
            enqueueSnackbar(`Error al obtener los documentos del usuario:\n${error.data.data.error}`, { variant: 'error' });
        }
    }

    useEffect(() => {
        // Recupero el usuario y sus documentos de la BD y los asigno a los estados user y userDocuments. 
        const getUserAndDocs = async () => {
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

            getUserDocuments(response2.data.data);
        }

        getUserAndDocs();
    }, []);


    const sendForm = async (values) => {
        setLoading(true);

        if (!fileUploaded) {
            enqueueSnackbar('Debes subir un archivo primero', { variant: 'warning' })
            return setLoading(false);
        }

        try {
            // Enviamos la pregunta al backend para obtener la respuesta basada en el archivo subido
            const response2 = await askAi({ query: values });

            if (response2.status !== 200) {
                enqueueSnackbar('Error al obtener la respuesta:\n' + response2.data.error.message, { variant: 'error' });
                return setLoading(false);
            }

            // Guardamos la respuesta en el estado answer
            setAnswer(response2.data.data);

            // Obtenemos el id del documento subido comparando el nombre y el tamaño del archivo subido con el de la BD
            const matchDocument = userDocuments.find(doc =>
                fileUploaded.name === doc.nombre_archivo && fileUploaded.size === doc.size
            );

            //Registramos la pregunta realizada en la base de datos
            const fileValues = {
                usuario_id: user.id,
                documento_id: matchDocument.id,
                pregunta: values.query
            }
            const response = await insertQuestion(fileValues);

            if (response.status !== 200) {
                enqueueSnackbar('Error al guardar la pregunta:\n' + response.data.data.error, { variant: 'error' });
                return setLoading(false);
            }

            enqueueSnackbar('Pregunta guardada', { variant: 'info' });
            setLoading(false)
        } catch (error) {
            return enqueueSnackbar(response.data.data.error ? 'Error al obtener la respuesta:\n' + (response.data.data.error) : 'Error al obtener la respuesta:\n' + (response2.data.data.error), { variant: 'error' });
        }

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
                <Typography variant="h2" sx={{ my: 2, mb: 3, textAlign: 'center' }
                }>Pregúntame algo sobre tu archivo</Typography >
                <Box component="form" sx={{ display: 'flex', width: '90%', flexDirection: 'column', gap: 15 }} onSubmit={handleSubmit(sendForm)}>
                    <Stack direction="row" justifyContent={'space-between'} display='flex' width='100%' gap={2} my={3}>
                        <TextField
                            type='text'
                            {...register("query", {
                                required: "Haz una pregunta..."
                            })}
                            error={!!errors.query}
                            helperText={errors.query?.message}
                            sx={{ width: '100%', minWidth: 100 }}
                        />
                        <Button
                            sx={{ maxHeight: 55 }}
                            variant="contained"
                            type="submit">
                            {loading ? <CircularProgress size={24} sx={{ color: "darkblue" }} /> : "Enviar"}
                        </Button>
                    </Stack>
                </Box >
                {loading &&
                    <Typography variant="h6" sx={{ pb: 2, textAlign: 'center' }}>Tu consulta está en proceso... ¡Pronto estará lista! 🚀</Typography>}
                <Box sx={{ p: 3, py: 4, backgroundColor: 'darkblue', borderRadius: 5, color: '#fff', width: '95%' }}>
                    <Typography variant="body1" fontSize={18}>{answer}</Typography>
                </Box>
            </Box>
        </Container>

    );
};

export default Questioner;
