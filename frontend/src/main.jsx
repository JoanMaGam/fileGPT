import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from 'notistack';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import axios from 'axios';


// Este interceptor añade el token a la cabecera de autorización siempre que el usuario esté logado.
axios.interceptors.request.use((request) => {
  if (localStorage.getItem('userLogged_token')) {
    request.headers.Authorization = localStorage.getItem('userLogged_token');
  }
  return request;
});

createRoot(document.getElementById('root')).render(
  //  Providers de Alerts y de Confirms 
  < SnackbarProvider maxSnack={3} autoHideDuration={4000} >
    <DialogsProvider>
      <App />
    </DialogsProvider>
  </SnackbarProvider >
)
