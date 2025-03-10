import { createRoot } from 'react-dom/client'
import axios from 'axios';
import { SnackbarProvider } from 'notistack';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import ThemeContextProvider from './theme/ThemeContextProvider.jsx';
import './index.css'
import App from './App.jsx'


// Este interceptor añade el token a la cabecera de autorización siempre que el usuario esté logado.
axios.interceptors.request.use((request) => {
  if (localStorage.getItem('userLogged_token')) {
    request.headers.Authorization = localStorage.getItem('userLogged_token');
  }
  return request;
});

createRoot(document.getElementById('root')).render(
  // Provider de tema
  <ThemeContextProvider>
    {/* Providers de Alerts y de Confirms  */}
    < SnackbarProvider maxSnack={3} autoHideDuration={4000} >
      <DialogsProvider>
        <App />
      </DialogsProvider>
    </SnackbarProvider >
  </ThemeContextProvider>
)

