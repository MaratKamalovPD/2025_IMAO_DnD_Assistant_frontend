import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  EncounterTrackerSaveProvider,
  EncounterTrackerSessionProvider,
  LoginRequiredProvider,
} from 'app/providers';
import { Bestiary, CreatureStatblock } from 'pages/bestiary';
import { Characters } from 'pages/characters';
import { EncounterList } from 'pages/encounterList/';
import { EncounterTracker } from 'pages/encounterTracker';
import { Login } from 'pages/login';
import { Main } from 'pages/main';
import { StatblockGenerator } from 'pages/statblockGenerator';
import { TestPage } from 'pages/test';
import { Footer, Placeholder } from 'shared/ui';
import { Header } from 'widgets/header';

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
    path: 'bestiary',
    element: (
      <>
        <Header />
        <Bestiary />
        <Footer />
      </>
    ),
    children: [
      {
        path: ':creatureName',
        element: <CreatureStatblock />,
      },
    ],
  },
  {
    path: 'encounter_tracker',
    element: (
      <>
        <Header />
        <EncounterTracker />
      </>
    ),
  },
  {
    path: 'encounter_tracker/:id',
    element: (
      <LoginRequiredProvider>
        <Header />
        <EncounterTrackerSaveProvider>
          <EncounterTracker />
        </EncounterTrackerSaveProvider>
      </LoginRequiredProvider>
    ),
  },
  {
    path: 'encounter_tracker/session/:id',
    element: (
      <LoginRequiredProvider>
        <Header />
        <EncounterTrackerSessionProvider>
          <EncounterTracker />
        </EncounterTrackerSessionProvider>
      </LoginRequiredProvider>
    ),
  },

  {
    path: 'characters',
    element: (
      <LoginRequiredProvider>
        <Header />
        <Characters />
        <Footer />
      </LoginRequiredProvider>
    ),
  },
  {
    path: 'login',
    element: (
      <>
        <Header />
        <Login />
        <Footer />
      </>
    ),
  },
  {
    path: 'statblock_generator',
    element: (
      <>
        <Header />
        <StatblockGenerator />
        <Footer />
      </>
    ),
  },
  {
    path: 'encounter_list',
    element: (
      <LoginRequiredProvider>
        <Header />
        <EncounterList />
        <Footer />
      </LoginRequiredProvider>
    ),
  },
  {
    path: '*',
    element: (
      <Placeholder
        title='404 Страница не найдена'
        subtitle='К сожалению, cтраница, на которую вы пытаетесь попасть, не существует или была удалена :('
        buttonText='Вернутся в бестиарий'
      />
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
