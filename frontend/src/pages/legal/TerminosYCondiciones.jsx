import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const TerminosYCondiciones = () => {
    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }} align="center">
                Términos y Condiciones
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                1. Objeto
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Los presentes términos regulan el uso del sitio web <strong>FileGPT</strong>, así como los servicios ofrecidos en la plataforma.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                2. Uso del Sitio Web
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Al acceder y utilizar <strong>FileGPT</strong>, el usuario acepta cumplir las siguientes normas:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="No utilizar el sitio con fines ilegales o fraudulentos." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="No vulnerar derechos de terceros ni dañar la reputación del sitio." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="No distribuir contenido malicioso o dañino." />
                </ListItem>
            </List>

            <Typography variant="h6" sx={{ mb: 2 }}>
                3. Registro y Acceso
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Al registrarse en <strong>FileGPT</strong>, el usuario es responsable de la veracidad de los datos proporcionados y de mantener la confidencialidad de sus credenciales de acceso.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                4. Modificaciones
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>FileGPT</strong> se reserva el derecho de modificar los presentes términos en cualquier momento, notificándolo a los usuarios en caso de cambios significativos.
            </Typography>
        </Container>
    );
};

export default TerminosYCondiciones;
