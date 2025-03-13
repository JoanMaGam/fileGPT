import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { updateUserByEmail, updatePassword } from '../services/users.services';
import { Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';


const EditUser = () => {

    const [user, setUser] = useState({});

    //Obtengo el usuario de la ubicación pasada por state a través del Link
    const location = useLocation();
    const { usuario } = location.state || {};

    //Hooks para los alert y los confirm
    const { enqueueSnackbar } = useSnackbar();

    // Hooks para formulario
    const { register, handleSubmit, reset, formState, watch } = useForm({
        defaultValues: { rol_id: "" } // Asegura que el valor inicial sea vacío o un valor específico
    });
    const { errors } = formState;

    // Hook de navegación
    const navigate = useNavigate();

    // Escucha cambios del valor del select
    const selectedRole = watch("rol_id");

    useEffect(() => {
        //Si existe 'usuario' el editUser carga los datos del usuario seleccionado en userList
        if (usuario) {
            setUser(usuario)

            // Creo un nuevo objeto con todos los valores excepto 'password' para que no se muestre en la edición del formulario.
            const { password, ...restOfValues } = usuario;

            // Reseteo el formulario con los nuevos valores, sin afectar 'password'
            reset(restOfValues);
        }
    }, []);

    const sendForm = async (values) => {

        // Compruebo si ha habido modificaciones en algun campo del formulario:
        if (values.nombre === user.nombre && values.apellidos === user.apellidos
            && values.rol_id === user.rol_id && values.password === '' && values.newPassword === '') {
            return enqueueSnackbar('No se han realizado cambios en el perfil', { variant: 'info' });
        }

        //Compruebo que los campos nombre y apellidos no estén vacíos
        if (values.nombre === '' || values.apellidos === '') {
            return enqueueSnackbar('Los campos "Nombre" y "Apellido/s" no pueden estar vacíos.', { variant: 'warning' });
        }

        //Si ha habido modificaciones, actualizo los datos del usuario en la BD
        else {
            //Creo un objeto con el email del usuario y los valores del formulario para pasarlo como una única variable
            values = { userEmail: user.email, ...values }

            //Compruebo si los campos de modificación de contraseña contienen algo
            if (values.password || values.newPassword) {

                //Si contienen algo, llamo al servicio para actualizar la contraseña en la BD.
                const responsee = await updatePassword(values);
                if (responsee.status !== 200) {
                    return enqueueSnackbar('Error al actualizar la contraseña:\n' + responsee.data.data.error, { variant: 'error' });
                }
            }

            //Actualizo los datos del usuario en la BD
            const response = await updateUserByEmail(values);

            if (response.status !== 200) {
                return enqueueSnackbar('Error al actualizar el perfil:\n' + response.data.data.error, { variant: 'error' });
            }
        }

        enqueueSnackbar('Usuario editado correctamente', { variant: 'success' });

        navigate('../users');
    }

    return (
        <Box>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: "baseline",
                    mt: { md: 0, xl: 5 }
                }}>
                <Link to={`../users`} >
                    <Button variant='contained'>Cancelar Edición</Button>
                </Link>
                <Typography variant='h2' sx={{ my: 2 }}>Editar Usuario</Typography>
                <Box component={Paper} p={{ xxs: .5, xs: 2.5, sm: 5 }} width='100%' maxWidth={550}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 500, gap: { xxs: .5, xs: 1, sm: 2 } }} onSubmit={handleSubmit(sendForm)}>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Nombre </Typography>
                            <TextField
                                type='text'
                                {...register("nombre")}
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                                size='small'
                                autoFocus
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Apellido/s </Typography>
                            <TextField
                                type='text'
                                {...register("apellidos")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                size='small'
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Stack direction="column" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Selecciona rol</Typography>
                            <TextField
                                select
                                value={selectedRole}
                                {...register('rol_id', {
                                    required: 'El campo Rol es requerido',
                                })}
                                error={!!errors.rol_id}
                                helperText={errors.rol_id?.message}
                                size='small'
                            >
                                <MenuItem value="1">Admin</MenuItem>
                                <MenuItem value="2">Usuario</MenuItem>
                            </TextField>
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Email </Typography>
                            <TextField
                                type='text'
                                {...register("email")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                size='small'
                                sx={{ maxWidth: 300, width: '100%' }}
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Contraseña actual</Typography>
                            <TextField
                                type='password'
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                size='small'
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Nueva Contraseña</Typography>
                            <TextField
                                type='password'
                                {...register("newPassword")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                size='small'
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Button
                            variant='outlined'
                            sx={{ width: '100%', padding: '1rem' }}
                            type="submit">
                            Guardar Cambios
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box >
    )
}

export default EditUser