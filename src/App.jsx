import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import IntroPage    from './pages/IntroPage';
import QuizPage     from './pages/QuizPage';
import ScorePage    from './pages/ScorePage';
import RegisterPage from './pages/RegisterPage';
import VaultPage    from './pages/VaultPage';
import ConfirmPage  from './pages/ConfirmPage';

function Root() {
  const location = useLocation();
  const hideLayout = location.pathname === '/quiz';
  return (
    <>
      {!hideLayout && <Layout />}
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/',         element: <IntroPage />    },
      { path: '/quiz',     element: <QuizPage />     },
      { path: '/score',    element: <ScorePage />    },
      { path: '/register', element: <RegisterPage /> },
      { path: '/vault',    element: <VaultPage />    },
      { path: '/confirm',  element: <ConfirmPage />  },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
