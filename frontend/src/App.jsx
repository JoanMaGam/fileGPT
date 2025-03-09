import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
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
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import DocumentsList from './pages/DocumentsList';
import FileUpload from './components/FileUpload';
import QuestionsList from './pages/QuestionsList';

// Layout para la sección de administración
const AdminLayout = () => {
  return (
    <>
      <Typography variant="h3" sx={{ textAlign: 'center', p: 2 }}>Panel de Administración</Typography>
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
          <Route path='/file-upload' element={<FileUpload />} />
        </Route>


        {/* Backoffice  */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Login />} />

          {/* Rutas protegidas (usuario rol Administrador 'root') */}
          <Route element={<ProtectedAdminRoute redirectPath='/login' />}>
            <Route path='users' element={<UsersList />} />
            <Route path='documents' element={<DocumentsList />} />
            <Route path='questions' element={<QuestionsList />} />
            <Route path='documents/add-file' element={<FileUpload />} />
            <Route path='addUser' element={<AddUser />} />
            <Route path='editUser' element={<EditUser />} />
          </Route>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Typography variant='h2' sx={{ textAlign: 'center', p: 5 }}>404 Not Found</Typography>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

