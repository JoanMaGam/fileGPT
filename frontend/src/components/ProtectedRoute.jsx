import { useSnackbar } from "notistack";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { isLogged, profile } from "../services/users.services";
import { useEffect } from "react";


const ProtectedRoute = ({ redirectPath }) => {

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    // Hook de navegación
    const navigate = useNavigate();

    useEffect(() => {
        // Accedo a la ruta de profile para validar el token en el backend
        const getProfile = async () => {
            try {
                const response = await profile();
                // En caso de estado 401, elimino el token del localStorage y redirijo al usuario
                if (response.status === 401) {
                    localStorage.removeItem('userLogged_token')
                    navigate(redirectPath)
                    return enqueueSnackbar('Sesión expirada. Vuelve a iniciar sesión.', { variant: 'warning' });
                }
                if (response.status !== 200) {
                    return enqueueSnackbar('Error al obtener el perfil de usuario:\n' + response.data.fatal || 'Error desconocido', { variant: 'error' });
                }
                return;
            } catch (error) {
                // En caso de estado 401, elimino el token del localStorage y redirijo al usuario
                if (error.response?.status == 401) {
                    localStorage.removeItem('userLogged_token')
                    navigate(redirectPath)
                    return enqueueSnackbar('Sesión expirada. Vuelve a iniciar sesión.', { variant: 'warning' });
                } else {
                    return enqueueSnackbar('Error al obtener el perfil de usuario.', { variant: 'error' });
                }
            }
        }
        getProfile();

    }, []);

    //Compruebo si el usuario está logado. Si lo está puede acceder a la ruta, si no, es redirigido.
    if (!isLogged()) {
        enqueueSnackbar('Ruta protegida. Debes estar logado.', { variant: 'warning' });
        return <Navigate to={redirectPath} />
    };

    return <Outlet />
};

export { ProtectedRoute };
