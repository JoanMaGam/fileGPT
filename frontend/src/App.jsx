import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute'
import { Typography } from '@mui/material';
import Login from "./pages/Login";
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UsersList from './pages/UsersList';
import Footer from './components/Footer';
import PoliticaDePrivacidad from './pages/legal/PoliticaDePrivacidad';
import TerminosYCondiciones from './pages/legal/TerminosYCondiciones';
import PoliticaDeCookies from './pages/legal/PoliticaDeCookies';
import AvisoLegal from './pages/legal/AvisoLegal';
import { isLogged, isAdmin } from './services/users.services';

// Layout para la sección de administración
const AdminLayout = () => {
  if (!isLogged()) {
    return <Navigate to="/login" replace />; // Redirige al login si no está logeado
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />; // Si está logueado pero no es admin, redirige a home
  }

  return (
    <>
      <Outlet /> {/* Renderiza las subrutas de /admin */}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Rutas legales */}
        <Route path='/aviso-legal' element={<AvisoLegal />} />
        <Route path='/politica-de-privacidad' element={<PoliticaDePrivacidad />} />
        <Route path='/terminos-y-condiciones' element={<TerminosYCondiciones />} />
        <Route path='/politica-de-cookies' element={<PoliticaDeCookies />} />

        {/* Rutas protegidas (usuarios autenticados) */}
        <Route element={<ProtectedRoute redirectPath='/login' />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        {/* Backoffice  */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Typography variant="h4">Panel de Administración</Typography>} />
          <Route path='usersList' element={<UsersList />} />
          {/* <Route path='usersList/:userID' element={<UserDetails />} /> */}
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Typography variant='h2'>404 Not Found</Typography>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

