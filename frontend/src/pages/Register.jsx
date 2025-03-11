import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
// import { register } from '../services/users.services';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { registerUser } from '../services/users.services';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Register = () => {

    const [toggleInput, setToggleInput] = useState('password');
    const [toggleIcon, setToggleIcon] = useState(<RemoveRedEyeOutlinedIcon />);

    // Hooks para formulario y errores
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    // Hook para navegación
    const navigate = useNavigate();

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Función para mostrar/ocultar la contraseña
    const toggleI = () => { return toggleInput === 'text' ? (setToggleInput('password'), setToggleIcon(<RemoveRedEyeOutlinedIcon />)) : (setToggleInput('text'), setToggleIcon(<VisibilityOffOutlinedIcon />)) }

    const sendForm = async (values) => {

        const newValues = { ...values, rol_id: 2 }
        //Registro del usuario en la BD
        const response = await registerUser(newValues);

        if (response.status !== 200) {
            return enqueueSnackbar('Error al registrar el usuario:\n' + response.data.data.error, { variant: 'error' });
        }

        enqueueSnackbar('Usuario creado correctamente', { variant: 'success' });

        navigate('/login');
    }

    return (
        <>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    mt: { md: 1, xl: 5 }
                }}>
                <Box
                    sx={{
                        width: { md: "60%" },
                        placeItems: "center",
                        p: 3,
                        pb: 6,
                        mt: 3,
                        bgcolor: "#071544",
                        border: 3,
                        borderColor: 'lightskyblue',
                        borderRadius: 2,
                    }}
                >

                    <Typography variant='h2' sx={{ mb: 2 }}>Registro de Usuario</Typography>
                    <Box component={Paper} p={{ xxs: .5, xs: 2.5, sm: 5 }} maxWidth={500} >
                        <Box component="form" style={{ display: 'flex', flexDirection: 'column', gap: 15 }} onSubmit={handleSubmit(sendForm)}>
                            <Stack direction={{ xxs: 'column', sm: 'row' }} justifyContent={'space-between'} gap={2}>
                                <Typography variant='body1'>Nombre</Typography>
                                <TextField
                                    type='text'
                                    {...register("nombre", {
                                        required: 'El campo Nombre es requerido',
                                    })}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                    size='small'
                                    autoFocus
                                    sx={{ maxWidth: 280, width: '100%' }}
                                />
                            </Stack>
                            <Stack direction={{ xxs: 'column', sm: 'row' }} justifyContent={'space-between'} gap={2}>
                                <Typography variant='body1'>Apellidos</Typography>
                                <TextField
                                    type='text'
                                    {...register("apellidos", {
                                        required: 'El campo Apellidos es requerido',
                                    })}
                                    error={!!errors.apellidos}
                                    helperText={errors.apellidos?.message}
                                    size='small'
                                    autoFocus
                                    sx={{ maxWidth: 280, width: '100%' }}
                                />
                            </Stack>
                            <Stack direction={{ xxs: 'column', sm: 'row' }} justifyContent={'space-between'} gap={2}>
                                <Typography variant='body1'>Email</Typography>
                                <TextField
                                    type='text'
                                    {...register("email", {
                                        required: 'El campo Email es requerido',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Formato de email no válido'
                                        }
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    size='small'
                                    sx={{ maxWidth: 280, width: '100%' }}
                                />
                            </Stack>
                            <Stack direction={{ xxs: 'column', sm: 'row' }} justifyContent={'space-between'} gap={2}>
                                <Typography variant='body1'>Contraseña</Typography>
                                <Stack direction='row' gap={1}>
                                    <TextField
                                        type={toggleInput}
                                        {...register("password", {
                                            required: 'El campo Contraseña es requerido',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                                message:
                                                    "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un símbolo.",
                                            },
                                        })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        size='small'
                                        sx={{ maxWidth: 280, width: '100%' }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => toggleI()}
                                        sx={{
                                            backgroundColor: 'lightgrey',
                                            maxHeight: 40
                                        }}>{toggleIcon}</Button>
                                </Stack>
                            </Stack>
                            <Button
                                variant='outlined'
                                sx={{ width: '100%', padding: '1rem', fontWeight: 'bold' }}
                                type="submit">
                                Registrarme
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container >
        </>
    )
}

export default Register;