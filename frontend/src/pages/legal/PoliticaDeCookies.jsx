import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const PoliticaDeCookies = () => {
    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Política de Cookies
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                En FileGPT, utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico web y personalizar contenido y anuncios. Al acceder a nuestro sitio web, aceptas el uso de cookies de acuerdo con esta Política de Cookies.
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                1. ¿Qué son las cookies?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten recordar tus preferencias y mejorar tu experiencia de navegación.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                2. ¿Por qué usamos cookies?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Utilizamos cookies para los siguientes fines:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Cookies necesarias para el funcionamiento del sitio." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Cookies de análisis para mejorar la experiencia del usuario." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Cookies de personalización para recordar tus preferencias." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Cookies publicitarias para mostrar anuncios relevantes." />
                </ListItem>
            </List>

            <Typography variant="h6" sx={{ mb: 2 }}>
                3. ¿Cómo controlar las cookies?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Puedes controlar y gestionar las cookies a través de la configuración de tu navegador.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                4. Actualización de la Política de Cookies
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Nos reservamos el derecho de actualizar o modificar esta política. Te recomendamos que la revises regularmente. Cualquier cambio significativo será notificado de forma destacada en el sitio.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                5. Contacto
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos a través de info@filegpt.com.
            </Typography>
        </Container>
    );
};

export default PoliticaDeCookies;
