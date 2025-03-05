import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const AvisoLegal = () => {
    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }} align="center">
                Aviso Legal
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                1. Identificación del Responsable
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                En cumplimiento con lo dispuesto en la normativa vigente, se informa que el presente sitio web, <strong>FileGPT</strong>, es propiedad de:
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Titular: FileGPT SL" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="CIF: A-32100123" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Dirección: Calle Falsa 2, Barcelona" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Correo electrónico: legal@filegpt.com" />
                </ListItem>
            </List>

            <Typography variant="h6" sx={{ mb: 2 }}>
                2. Propiedad Intelectual
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos, y diseño, están protegidos por derechos de autor y propiedad intelectual, y no pueden ser reproducidos sin autorización expresa.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                3. Responsabilidad
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                El propietario de FileGPT no se hace responsable del mal uso de la información publicada ni de daños que puedan derivarse del uso del sitio web.
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                4. Enlaces Externos
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Este sitio puede contener enlaces a terceros, pero no asumimos responsabilidad por el contenido de dichas páginas externas.
            </Typography>
        </Container>
    );
};

export default AvisoLegal;
