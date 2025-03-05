import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { profile } from "../services/users.services";
import { useSnackbar } from "notistack";


const ProtectedAdminRoute = ({ redirectPath }) => {

    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true);

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Recupero el usuario y lo asigno al estado user.
        const getProfile = async () => {
            try {
                const response = await profile();

                if (response.status !== 200) {
                    return enqueueSnackbar('Error al obtener el perfil de usuario:\n' + response.data.data.error, { variant: 'error' });
                }
                setUser(response.data.user);
            } catch (error) {
                return error.message;
            } finally {
                setIsLoading(false);
            }
        }
        getProfile();
    }, []);

    //Renderizo un mensaje en función del estado isLoading para evitar que se muestre el contenido de la página antes de que salte el alert.
    if (isLoading) {
        return (
            <div>Cargando datos...</div>
        );
    }

    //Compruebo el rol de usuario. Si no es 'admin'(1), no puede acceder a la ruta y es redirigido a su perfil.
    if (user.user_rol !== 1) {
        enqueueSnackbar('Debes ser Admin para acceder a esta ruta', { variant: 'warning' })
        return <Navigate to={redirectPath} />
    }

    return <Outlet />
};

export { ProtectedAdminRoute };
