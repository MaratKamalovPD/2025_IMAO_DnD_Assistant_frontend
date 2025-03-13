import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Link } from 'react-router';

import { TestPage } from 'pages/test';

const Test = () => {
  return (
    <div>
      Hello, world!
      <Link to='test'>TestPage</Link>
    </div>
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
