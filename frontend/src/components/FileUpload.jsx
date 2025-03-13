import { Box, Button, Container, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getUserByEmail, isLogged, profile } from "../services/users.services";
import { useNavigate } from "react-router-dom";
import { insertDocument } from "../services/documents.services";
import { useEffect, useState } from "react";
import { uploadDoc } from "../services/ai.services";

const FileUpload = () => {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    // Hook para el formulario
    const { register, handleSubmit, formState, watch } = useForm();
    const { errors } = formState;

    // Hook de navegación
    const navigate = useNavigate();

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Escucho los cambios del campo 'file' del formulario y obtengo el item
    const file = watch("file");

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

    const sendForm = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file[0]);

        if (file) {
            try {
                // Enviamos el archivo al backend para guardarlo en la base de datos vectorial
                const response2 = await uploadDoc(formData);

                if (response2.status !== 200) {
                    enqueueSnackbar('Error al subir el archivo1:\n' + response2.data.message, { variant: 'error' });
                    return setLoading(false);
                }


                //Registro del nombre del archivo en la base de datos
                const fileValues = { usuario_id: user.id, nombre_archivo: file[0].name, size: parseInt(file[0].size) }

                const response = await insertDocument(fileValues);

                if (response.status !== 200) {
                    enqueueSnackbar('Error al subir el archivo2:\n' + response.data.error, { variant: 'error' });
                    return setLoading(false);
                }

                enqueueSnackbar('Archivo subido con éxito', { variant: 'success' });
                setLoading(false);

                //Redirijo al usuario a /questioner pasándole el archivo
                navigate('/questioner', { state: { fileUploaded: file[0] } });
            } catch (error) {
                enqueueSnackbar(response.data.error ? 'Error al subir el archivo3:\n' + (response.data.error) : 'Error al subir el archivo4:\n' + (response2.data?.error || "Error interno"), { variant: 'error' });
                return setLoading(false);
            }
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
                <Typography variant="h2" sx={{ my: 2, mb: 3 }
                }> Sube tu Archivo</Typography >
                <Box component="form" style={{ display: 'flex', flexDirection: 'column', gap: 15 }} onSubmit={handleSubmit(sendForm)}>
                    <Stack direction="column" justifyContent={'space-between'} gap={4} my={3}>
                        <TextField
                            type='file'
                            {...register("file", {
                                required: "Selecciona un archivo"
                            })}
                            error={!!errors.file}
                            helperText={errors.file?.message}
                            accept=".pdf" // Limito los archivos aceptados
                            sx={{ minWidth: 100 }}
                        />
                        <Button
                            variant="contained"
                            disabled={!file || loading} //Deshabilito el botón mientras no haya archivo o cuando esté cargando
                            sx={{ width: '100%', padding: '1rem' }}
                            type="submit">
                            {loading ? <CircularProgress size={24} sx={{ color: "darkblue" }} /> : "Subir Archivo"}
                        </Button>
                        {loading &&
                            <Typography variant="h6">Se está subiendo el archivo, gracias por tu paciencia 😊</Typography>}
                    </Stack>
                </Box >
            </Box>
        </Container>

    );
};

export default FileUpload;
