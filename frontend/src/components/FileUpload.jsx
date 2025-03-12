import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { getUserByEmail, isLogged, profile } from "../services/users.services";
import { useNavigate } from "react-router-dom";
import { insertDocument } from "../services/documents.services";
import { useEffect, useState } from "react";
import { uploadDoc } from "../services/ai.services";

const FileUpload = () => {

    const [user, setUser] = useState({});

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

        const formData = new FormData();
        formData.append("file", file[0]);
        console.log(formData);

        if (file) {
            try {
                // Enviamos el archivo al backend para guardarlo en la base de datos vectorial
                const response2 = await uploadDoc(formData);
                console.log(response2);

                if (response2.status !== 200) {
                    return enqueueSnackbar('Error al subir el archivo:\n' + response2.data.error.message, { variant: 'error' });
                }
                console.log("Archivo subido con éxito:", response2.data.message);


                //Registro del nombre del archivo en la base de datos
                const fileValues = { usuario_id: user.id, nombre_archivo: file[0].name }

                const response = await insertDocument(fileValues);

                if (response.status !== 200) {
                    return enqueueSnackbar('Error al subir el archivo:\n' + response.data.data.error, { variant: 'error' });
                }

            } catch (error) {
                // return console.error("Error al subir el archivo", error);
                return enqueueSnackbar('Error al subir el archivo:\n' + response.data.data.error, { variant: 'error' });
            }

            enqueueSnackbar('Archivo subido con éxito', { variant: 'success' });

            navigate('/questioner');
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
                            disabled={!file}
                            sx={{ width: '100%', padding: '1rem' }}
                            type="submit">
                            Subir Archivo
                        </Button>
                    </Stack>
                </Box >
            </Box>
        </Container>

    );
};

export default FileUpload;
