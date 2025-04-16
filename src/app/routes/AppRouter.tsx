import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HeaderProviders } from 'app/providers';
import { Bestiary, CreatureStatblock } from 'pages/bestiary';
import { Characters } from 'pages/characters';
import { EncounterTracker } from 'pages/encounterTracker';
import { Login } from 'pages/login';
import { Main } from 'pages/main';
import { TestPage } from 'pages/test';
import { StatblockGenerator} from 'pages/statblockGenerator';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: 'test',
    element: <TestPage />,
  },
  {
    path: 'encounter_tracker',
    element: (
      <HeaderProviders>
        <EncounterTracker />
      </HeaderProviders>
    ),
  },
  {
    path: 'bestiary',
    element: (
      <HeaderProviders>
        <Bestiary />
      </HeaderProviders>
    ),
    children: [
      {
        path: ':creatureName',
        element: <CreatureStatblock />,
      },
    ],
  },
  {
    path: 'characters',
    element: (
      <HeaderProviders>
        <Characters />
      </HeaderProviders>
    ),
  },
  {
    path: 'login',
    element: (
      <HeaderProviders>
        <Login />
      </HeaderProviders>
    ),
  },
  {
    path: 'statblock_generator',
    element: (
      <HeaderProviders>
        <StatblockGenerator />
      </HeaderProviders>
    ),
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
