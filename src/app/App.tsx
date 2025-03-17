import { AppRouter } from './routes';

import 'app/styles/global.scss';
import { MainProviders } from './providers';

function App() {
  return (
    <MainProviders>
      <AppRouter />
    </MainProviders>
  );
}

export default App;
