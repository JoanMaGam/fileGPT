import { Navigate, Outlet } from "react-router-dom";
import { useSnackbar } from "notistack";
import { isAdmin } from "../services/users.services";


const ProtectedAdminRoute = ({ redirectPath }) => {

    // //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Compruebo el rol de usuario. Si no es 'admin'(1), no puede acceder a la ruta y es redirigido a su perfil.
    if (!isAdmin()) {
        enqueueSnackbar('Debes ser Admin para acceder a esta ruta', { variant: 'warning' })
        return <Navigate to={redirectPath} />
    }

    return <Outlet />
};

export { ProtectedAdminRoute };
