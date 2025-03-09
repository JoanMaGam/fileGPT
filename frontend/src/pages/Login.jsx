import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { isAdmin, login } from '../services/users.services';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Login = () => {

    const [toggleInput, setToggleInput] = useState('password');
    const [toggleIcon, setToggleIcon] = useState(<RemoveRedEyeOutlinedIcon />);

    // Hooks para formulario y errores
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    // Hook para navegación
    const navigate = useNavigate();

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    // Hook para obtener la ruta actual y comparar si es '/login' para renderización condicional
    const location = useLocation();
    const isLoginRoute = location.pathname === '/login';

    //Función para mostrar/ocultar la contraseña
    const toggleI = () => { return toggleInput === 'text' ? (setToggleInput('password'), setToggleIcon(<RemoveRedEyeOutlinedIcon />)) : (setToggleInput('text'), setToggleIcon(<VisibilityOffOutlinedIcon />)) }


    const sendForm = async (values) => {
        const response = await login(values);

        //En función de la respuesta del login, muestro el error, guardo el token en el localStorage y muestro login correcto
        if (response.status !== 200) {
            return enqueueSnackbar('Error al iniciar sesión:\n' + response.data.data.error, { variant: 'error' });
        }

        localStorage.setItem('userLogged_token', response.data.token);

        if (response.data.token) {
            enqueueSnackbar('Login correcto!', { variant: 'success' });

            if (isAdmin()) {
                return navigate('/admin/users');
            }
            return navigate('/');
        }
    }

    return (
        <>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    minHeight: "100vh",
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
                    {isLoginRoute &&
                        <Typography variant='h2' sx={{ mb: 2 }}>Login</Typography>
                    }
                    <Box component={Paper} p={5} marginTop={3} maxWidth={500} >
                        <Box component="form" style={{ display: 'flex', flexDirection: 'column', gap: 15 }} onSubmit={handleSubmit(sendForm)}>
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
                                <Stack direction="row" gap={1}>
                                    <TextField
                                        type={toggleInput}
                                        {...register("password", {
                                            required: "Contraseña requerida"
                                        })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        size='small'
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
                                {isLoginRoute ? "Iniciar Sesión" : "Acceder al panel"}
                            </Button>
                        </Box>
                        {isLoginRoute &&
                            <Link to='/register'>
                                <Box sx={{ pt: 3, textAlign: 'right' }}>
                                    <Typography variant='body2'>¿No estás registrad@ aún?</Typography>
                                </Box>
                            </Link>
                        }
                    </Box>
                </Box>
            </Container >
        </>
    )
}

export default Login;