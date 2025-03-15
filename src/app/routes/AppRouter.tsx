import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Link } from 'react-router';

import { TestPage } from 'pages/test';
import { EncounterTracker } from 'pages/encounterTracker';

const Test = () => {
  return (
    <>
      <div>Hello, world!</div>
      <Link to='encounter_tracker'>EncounterTracker</Link>
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
