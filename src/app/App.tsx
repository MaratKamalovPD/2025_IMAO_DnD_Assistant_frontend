import 'pages/bestiary/ui/creatureStatblock/dice-roller';
import { Bounce, ToastContainer } from 'react-toastify';
import { MainProviders } from './providers';
import { AppRouter } from './routes';

import 'app/styles/global.scss';

const App = () => {
  return (
    <main>
      <MainProviders>
        <AppRouter />
        <div id='tooltip-root' />
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
          transition={Bounce}
          style={{ marginTop: '75px' }}
        />
      </MainProviders>
    </main>
  );
};

export default App;
