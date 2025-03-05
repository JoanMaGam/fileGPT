import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const PoliticaDePrivacidad = () => {
    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }} align="center">
                Política de Privacidad
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                1. Responsable del Tratamiento
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                El responsable del tratamiento de los datos personales es <strong>FileGPT</strong>, cuyos datos de contacto se detallan en el Aviso Legal.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                2. Datos Recopilados
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Recopilamos datos personales como nombre, correo electrónico y actividad en el sitio web con las siguientes finalidades:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Gestionar el acceso y uso de la plataforma." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Enviar comunicaciones o notificaciones importantes." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Mejorar la experiencia del usuario." />
                </ListItem>
            </List>

            <Typography variant="h6" sx={{ mb: 2 }}>
                3. Protección de Datos
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Los datos personales serán tratados con la máxima confidencialidad y de acuerdo con la normativa de protección de datos aplicable, incluyendo el <strong>RGPD</strong> (Reglamento General de Protección de Datos) y la <strong>LOPD-GDD</strong> (Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales).
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                4. Derechos del Usuario
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Los usuarios pueden ejercer sus derechos de acceso, rectificación, supresión y oposición enviando una solicitud a <Link>info@filegpt.com</Link>.
            </Typography>
        </Container >
    );
};

export default PoliticaDePrivacidad;
