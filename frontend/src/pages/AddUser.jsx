import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { profile, registerUser } from '../services/users.services';
import { Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const AddUser = () => {

    const [toggleInput, setToggleInput] = useState('password');
    const [toggleIcon, setToggleIcon] = useState(<RemoveRedEyeOutlinedIcon />);

    // Hook para el formulario
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    // Hook de navegación
    const navigate = useNavigate();

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();


    //Función para mostrar/ocultar la contraseña
    const toggleI = () => { return toggleInput === 'text' ? (setToggleInput('password'), setToggleIcon(<RemoveRedEyeOutlinedIcon />)) : (setToggleInput('text'), setToggleIcon(<VisibilityOffOutlinedIcon />)) }

    const sendForm = async (values) => {

        //Registro del usuario en la BD
        const response = await registerUser(values);

        if (response.status !== 200) {
            return enqueueSnackbar('Error al registrar el usuario:\n' + response.data.data.error, { variant: 'error' });
        }

        enqueueSnackbar('Usuario creado correctamente', { variant: 'success' });

        navigate('../users');
    }

    return (
        <>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "baseline",
                    mt: { md: 0, xl: 5 }
                }}>
                <Link to={`../users`} >
                    <Button variant='contained'>Volver</Button>
                </Link>
                <Typography variant='h2' sx={{ my: 2 }}>Registrar Usuario</Typography>
                <Box component={Paper} p={{ xxs: .5, xs: 2.5, sm: 5 }} width='100%' maxWidth={550}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 500, gap: { xxs: .5, xs: 1, sm: 2 } }} onSubmit={handleSubmit(sendForm)}>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Nombre </Typography>
                            <TextField
                                type='text'
                                {...register("nombre", {
                                    required: 'El campo Nombre es requerido',
                                })}
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                                size='small'
                                autoFocus
                                sx={{ maxWidth: 300, width: '100%' }}

                            />
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Apellidos </Typography>
                            <TextField
                                type='text'
                                {...register("apellidos", {
                                    required: 'El campo Nombre es requerido',
                                })}
                                error={!!errors.apellidos}
                                helperText={errors.apellidos?.message}
                                size='small'
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Stack direction="row" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Email </Typography>
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
                                sx={{ maxWidth: 300, width: '100%' }}
                            />
                        </Stack>
                        <Stack direction="column" justifyContent={'space-between'} gap={2}>
                            <Typography variant='body1'>Selecciona rol</Typography>
                            <TextField
                                select
                                defaultValue=""
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
                            <Typography variant='body1'>Contraseña </Typography>
                            <Stack direction="row" gap={{ xxs: .5, sm: 3 }}>
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
                                    sx={{ maxWidth: 300, width: '100%' }}
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
                            sx={{ width: '100%', padding: '1rem' }}
                            type="submit">
                            Añadir usuario
                        </Button>
                    </Box>
                </Box>
            </Container >
        </>
    )
}

export default AddUser;