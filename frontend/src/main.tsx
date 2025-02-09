import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import './assets/styles.scss';
import { DatabaseProvider } from './app/database.store.tsx';

const router = createBrowserRouter([{
    path: '/',
    element: <App />,
    index: true
}, {
    path: '*',
    element: <App />
}]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DatabaseProvider>
            <RouterProvider router={router} />
        </DatabaseProvider>
    </StrictMode>,
)
