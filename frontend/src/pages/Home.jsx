import { Box, Button, Container, Typography } from "@mui/material"
import { isLogged } from "../services/users.services"
import { useNavigate } from "react-router-dom";
import logo from './../../public/logo.webp';

const Home = () => {

    // Hook de navegación
    const navigate = useNavigate();

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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'lightskyblue',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            fontSize: { xxs: '2rem', sm: '2.5rem', md: '3rem' },
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        ¡Consulta tus PDFs con IA al instante!
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontSize: { xxs: '1rem', sm: '1.2rem', md: '1.5rem' },
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                color: '#0ff',
                            },
                        }}
                    >
                        ¡Accede a herramientas exclusivas de procesamiento inteligente de archivos!
                    </Typography>
                    <Box
                        component="img"
                        src={logo}
                        alt="Imagen de transformación IA"
                        sx={{
                            width: { xxs: '80px', sm: '100px', md: '150px' },
                            mb: 4,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                            borderRadius: 4
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            width: '100%',
                            maxWidth: '500px',
                            padding: 3,
                            fontSize: 16,
                            backgroundColor: '#0ff',
                            ':hover': {
                                backgroundColor: '#fff',
                                boxShadow: '0px 5px 7px ',
                                transform: 'scale(1.02)',
                            },
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0px 4px 6px ',
                            borderRadius: 9

                        }}
                        onClick={() => isLogged() ? navigate('/file-upload') : navigate('/login')}
                    >
                        {isLogged() ? '¡Sube tu archivo!' : 'Iniciar Sesión'}
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
export default Home