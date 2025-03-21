import { Bounce, ToastContainer } from 'react-toastify';
import { MainProviders } from './providers';
import { AppRouter } from './routes';

import 'app/styles/global.scss';

function App() {
  return (
    <main>
      <MainProviders>
        <AppRouter />
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
        />
      </MainProviders>
    </main>
  );
}

export default App;
