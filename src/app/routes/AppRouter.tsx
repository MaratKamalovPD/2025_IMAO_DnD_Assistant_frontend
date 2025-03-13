import { createHashRouter, RouterProvider } from 'react-router-dom';

import { TestPage } from './../../pages/test';

const router = createHashRouter([
  {
    path: '/',
    element: <TestPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
