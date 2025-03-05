import { useSnackbar } from "notistack";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = ({ redirectPath }) => {

    //Hook para los alert 
    const { enqueueSnackbar } = useSnackbar();

    //Compruebo si el usuario está logado. Si lo está puede acceder a la ruta, si no, es redirigido.
    if (!localStorage.getItem('userLogged_token')) {
        enqueueSnackbar('Ruta protegida. Debes estar logado.', { variant: 'warning' });
        return <Navigate to={redirectPath} />
    };

    return <Outlet />
};

export { ProtectedRoute };
