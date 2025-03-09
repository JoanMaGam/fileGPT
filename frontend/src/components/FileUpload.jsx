import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { isLogged } from "../services/users.services";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {

    // Hook para el formulario
    const { register, handleSubmit, formState, watch } = useForm();
    const { errors } = formState;

    // Hook de navegación
    const navigate = useNavigate();

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Escucho los cambios del campo 'file' del formulario y obtengo el item
    const file = watch("file");

    const sendForm = () => {
        console.log('----', file[0].name);

        if (file) {
            console.log("Subiendo archivo:", file);
            // Aquí puedes manejar la subida del archivo a tu servidor
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                minHeight: "100vh",
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
                            accept=".pdf,.doc,.txt" // Limito los archivos aceptados
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
