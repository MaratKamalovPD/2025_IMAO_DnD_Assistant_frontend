import { Link } from 'react-router';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Bestiary } from 'pages/bestiary';
import { EncounterTracker } from 'pages/encounterTracker';
import { Login } from 'pages/login/index';
import { TestPage } from 'pages/test';

const Test = () => {
  return (
    <>
      <div>Hello, world!</div>
      <div>
        <Link to='encounter_tracker'>EncounterTracker</Link>
      </div>
      <div>
        <Link to='bestiary'>Bestiary</Link>
      </div>
      <div>
        <Link to='login'>Login</Link>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Test />,
  },
  {
    path: 'test',
    element: <TestPage />,
  },
  {
    path: 'encounter_tracker',
    element: <EncounterTracker />,
  },
  {
    path: 'bestiary',
    element: <Bestiary />,
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
