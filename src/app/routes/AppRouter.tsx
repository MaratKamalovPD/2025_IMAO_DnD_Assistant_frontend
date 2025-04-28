import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HeaderProviders } from 'app/providers';
import { EncounterTrackerSaveProvider } from 'app/providers/encounterTrackerSaveProvider';
import { Bestiary, CreatureStatblock } from 'pages/bestiary';
import { Characters } from 'pages/characters';
import { EncounterList } from 'pages/encounterList/';
import { EncounterTracker } from 'pages/encounterTracker';
import { Login } from 'pages/login';
import { Main } from 'pages/main';
import { StatblockGenerator } from 'pages/statblockGenerator';
import { TestPage } from 'pages/test';
import { Footer } from 'shared/ui';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Main />
        <Footer />
      </>
    ),
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
    path: 'encounter_tracker/:id',
    element: (
      <HeaderProviders>
        <EncounterTrackerSaveProvider>
          <EncounterTracker />
        </EncounterTrackerSaveProvider>
      </HeaderProviders>
    ),
  },
  {
    path: 'bestiary',
    element: (
      <HeaderProviders>
        <Bestiary />
        <Footer />
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
        <Footer />
      </HeaderProviders>
    ),
  },
  {
    path: 'login',
    element: (
      <HeaderProviders>
        <Login />
        <Footer />
      </HeaderProviders>
    ),
  },
  {
    path: 'statblock_generator',
    element: (
      <HeaderProviders>
        <StatblockGenerator />
        <Footer />
      </HeaderProviders>
    ),
  },
  {
    path: 'encounter_list',
    element: (
      <HeaderProviders>
        <EncounterList />
        <Footer />
      </HeaderProviders>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
