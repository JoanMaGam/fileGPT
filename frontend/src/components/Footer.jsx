import { Box, Container, Typography } from "@mui/material"
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 3, mt: 5, backgroundColor: "dodgerblue", color: "white", textAlign: "center" }}>
            <Container>
                <Typography variant="body1">
                    &copy; {new Date().getFullYear()} FileGPT. Todos los derechos reservados.
                </Typography>
                <Typography variant="body2" component={Link} to="/aviso-legal" sx={{ textDecoration: "none", color: "inherit", px: 2, ":hover": { color: 'lightblue' } }}>
                    Aviso legal
                </Typography>
                |
                <Typography variant="body2" component={Link} to="/politica-de-privacidad" sx={{ textDecoration: "none", color: "inherit", px: 2, ":hover": { color: 'lightblue' } }}>
                    Política de Privacidad
                </Typography>
                |
                <Typography variant="body2" component={Link} to="/terminos-y-condiciones" sx={{ textDecoration: "none", color: "inherit", px: 2, ":hover": { color: 'lightblue' } }}>
                    Términos y Condiciones
                </Typography>
                |
                <Typography variant="body2" component={Link} to="/politica-de-cookies" sx={{ textDecoration: "none", color: "inherit", px: 2, ":hover": { color: 'lightblue' } }}>
                    Política de Cookies
                </Typography>
            </Container>
        </Box>
    )
}
export default Footer;